#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { WebsiteV3Stack } from '../lib/website-v3-stack';

const app = new cdk.App();
new WebsiteV3Stack(app, 'WebsiteV3Stack');
