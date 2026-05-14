import * as cdk from 'aws-cdk-lib/core';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as WebsiteV3 from '../lib/website-v3-stack';

test('SQS queue and CMS DynamoDB table are created', () => {
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
});
