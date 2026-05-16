import * as cdk from 'aws-cdk-lib/core';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as WebsiteV3 from '../lib/website-v3-stack';

test('CMS infrastructure is created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new WebsiteV3.WebsiteV3Stack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });

  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: 'WebsiteV3CMS',
    BillingMode: 'PAY_PER_REQUEST',
    KeySchema: Match.arrayWith([
      { AttributeName: 'id', KeyType: 'HASH' },
      { AttributeName: 'type', KeyType: 'RANGE' }
    ]),
    AttributeDefinitions: Match.arrayWith([
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'type', AttributeType: 'S' }
    ])
  });

  template.resourceCountIs('AWS::S3::Bucket', 2);

  template.resourceCountIs('AWS::Lambda::Function', 2);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'cms-admin-handler.handler',
    Runtime: 'nodejs20.x',
    Environment: {
      Variables: Match.objectLike({
        CMS_TABLE_NAME: Match.anyValue(),
        CMS_ASSETS_BUCKET: Match.anyValue(),
        CMS_PUBLIC_ASSETS_BUCKET: Match.anyValue()
      })
    }
  });

  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'cms-asset-handler.handler',
    Runtime: 'nodejs20.x',
    Environment: {
      Variables: Match.objectLike({
        CMS_ASSETS_BUCKET: Match.anyValue(),
        CMS_PUBLIC_ASSETS_BUCKET: Match.anyValue()
      })
    }
  });

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'WebsiteV3CMSApi'
  });

  template.hasResourceProperties('AWS::ApiGateway::Method', {
    AuthorizationType: 'AWS_IAM'
  });

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: Match.objectLike({
      Enabled: true
    })
  });

  template.hasResourceProperties('AWS::IAM::ManagedPolicy', {
    PolicyDocument: Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: 'execute-api:Invoke',
          Effect: 'Allow'
        })
      ])
    })
  });
});
