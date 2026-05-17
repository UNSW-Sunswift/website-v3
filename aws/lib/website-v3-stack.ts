import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib/core';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';

export class WebsiteV3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'WebsiteV3Queue', {
      visibilityTimeout: Duration.seconds(300)
    });

    const cmsTable = new dynamodb.Table(this, 'WebsiteV3CMS', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'type', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: 'WebsiteV3CMS'
    });

    const assetsBucket = new s3.Bucket(this, 'WebsiteV3CMSAssets', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true
    });

    const publicAssetsBucket = new s3.Bucket(this, 'WebsiteV3PublicAssets', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.HEAD,
            s3.HttpMethods.PUT
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag']
        }
      ]
    });

    const publicAssetsDistribution = new cloudfront.Distribution(this, 'WebsiteV3PublicAssetsDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(publicAssetsBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    });

    const lambdaCode = lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda'));

    const cmsAdminHandler = new lambda.Function(this, 'CmsAdminHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'cms-admin-handler.handler',
      code: lambdaCode,
      timeout: Duration.seconds(20),
      environment: {
        CMS_TABLE_NAME: cmsTable.tableName,
        CMS_ASSETS_BUCKET: assetsBucket.bucketName,
        CMS_PUBLIC_ASSETS_BUCKET: publicAssetsBucket.bucketName
      }
    });

    const cmsAssetHandler = new lambda.Function(this, 'CmsAssetHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'cms-asset-handler.handler',
      code: lambdaCode,
      timeout: Duration.seconds(20),
      environment: {
        CMS_ASSETS_BUCKET: assetsBucket.bucketName,
        CMS_PUBLIC_ASSETS_BUCKET: publicAssetsBucket.bucketName
      }
    });

    cmsTable.grantReadWriteData(cmsAdminHandler);
    assetsBucket.grantReadWrite(cmsAdminHandler);
    assetsBucket.grantReadWrite(cmsAssetHandler);
    publicAssetsBucket.grantReadWrite(cmsAdminHandler);
    publicAssetsBucket.grantReadWrite(cmsAssetHandler);

    const cmsApi = new apigateway.RestApi(this, 'WebsiteV3CMSApi', {
      restApiName: 'WebsiteV3CMSApi',
      deployOptions: {
        stageName: 'prod'
      },
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.IAM
      }
    });

    const adminIntegration = new apigateway.LambdaIntegration(cmsAdminHandler);
    const assetIntegration = new apigateway.LambdaIntegration(cmsAssetHandler);
    const cms = cmsApi.root.addResource('cms');
    const publicCms = cms.addResource('public');
    publicCms.addResource('{collection}').addMethod('GET', adminIntegration);
    const adminCms = cms.addResource('admin');
    adminCms.addResource('{collection}').addMethod('GET', adminIntegration);
    const adminCollection = adminCms.getResource('{collection}')!;
    const slug = adminCollection.addResource('{slug}');
    slug.addResource('draft').addMethod('PUT', adminIntegration);
    slug.addResource('publish').addMethod('POST', adminIntegration);
    adminCms.addResource('import').addResource('{collection}').addMethod('POST', adminIntegration);
    adminCms.addResource('uploads').addResource('presign').addMethod('POST', assetIntegration);

    const nextRuntimeInvokePolicy = new iam.ManagedPolicy(this, 'WebsiteV3NextRuntimeCmsInvokePolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: ['execute-api:Invoke'],
          resources: [cmsApi.arnForExecuteApi('*', '/cms/*', '*')]
        })
      ]
    });

    new CfnOutput(this, 'CMSAssetsBucketName', {
      value: assetsBucket.bucketName
    });

    new CfnOutput(this, 'CMSPublicAssetsBucketName', {
      value: publicAssetsBucket.bucketName
    });

    new CfnOutput(this, 'CMSPublicAssetBaseUrl', {
      value: `https://${publicAssetsDistribution.distributionDomainName}`
    });

    new CfnOutput(this, 'CMSApiUrl', {
      value: cmsApi.url
    });

    new CfnOutput(this, 'NextRuntimeCmsInvokePolicyArn', {
      value: nextRuntimeInvokePolicy.managedPolicyArn
    });
  }
}
