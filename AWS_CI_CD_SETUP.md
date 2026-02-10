# AWS CI/CD Setup for Selenium E2E Tests

This guide explains how to set up automated test execution completely managed from AWS when code is pushed to your Bitbucket repository.

## Table of Contents
- [AWS CodePipeline + CodeBuild (Recommended)](#aws-codepipeline--codebuild-recommended)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Viewing Test Reports](#viewing-test-reports)
- [Monitoring & Notifications](#monitoring--notifications)
- [Alternative Options](#alternative-options)

---

## AWS CodePipeline + CodeBuild (Recommended)

This approach provides **complete AWS-managed CI/CD** with no Bitbucket Pipelines required. Everything is controlled from AWS Console.

### Architecture Overview

```
Bitbucket Repository (Webhook) 
    ↓
AWS CodePipeline (Orchestration)
    ↓
AWS CodeBuild (Test Execution)
    ↓
Amazon S3 (Report Storage)
    ↓
Amazon SNS (Notifications)
```

---

## Prerequisites

Before starting, ensure you have:

1. ✅ AWS Account with admin access
2. ✅ Bitbucket repository with your test code
3. ✅ AWS CLI installed (optional, but recommended)
4. ✅ Basic understanding of AWS services

---

## Step-by-Step Setup

### Step 1: Create S3 Bucket for Test Reports

1. Go to **AWS S3 Console**: https://console.aws.amazon.com/s3/

2. Click **Create bucket**
   - Bucket name: `selenium-test-reports-v1` (must be globally unique)
   - AWS Region: `ap-south-1` (or your preferred region)
   - Block Public Access: Uncheck if you want public reports access
   - Click **Create bucket**

3. Enable Static Website Hosting:
   - Select your bucket → **Properties** tab
   - Scroll to **Static website hosting**
   - Click **Edit** → Enable
   - Index document: `index.html`
   - Click **Save changes**

4. Add Bucket Policy for Public Access (if needed):
   - Go to **Permissions** tab
   - Click **Bucket Policy** → Edit
   - Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::selenium-test-reports-v1/*"
    }
  ]
}
```

### Step 2: Create IAM Role for CodeBuild

1. Go to **IAM Console**: https://console.aws.amazon.com/iam/

2. Navigate to **Roles** → Click **Create role**

3. Select **AWS service** → Choose **CodeBuild** → Click **Next**

4. Attach these policies:
   - ✅ `AmazonS3FullAccess` (or create custom policy with S3 permissions)
   - ✅ `CloudWatchLogsFullAccess`
   - ✅ `AWSCodeBuildAdminAccess`

5. Name the role: `CodeBuildSeleniumTestsRole`

6. Click **Create role**

7. **Add Custom Inline Policy** for S3 access:
   - Select your role → **Add permissions** → **Create inline policy**
   - JSON tab:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::selenium-test-reports-v1",
        "arn:aws:s3:::selenium-test-reports-v1/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### Step 3: Create CodeBuild Project - Meeting 2

1. Go to **AWS CodeBuild Console**: https://console.aws.amazon.com/codebuild/

2. Click **Create build project**

3. **Project configuration**:
   - Project name: `selenium-e2e-tests`
   - Description: `Automated Selenium E2E test execution`

4. **Source**:
   - Source provider: **Bitbucket**
   - Repository: Click **Connect using OAuth** or **Connect with a Bitbucket app password**
   - For OAuth:
     - Click **Connect to Bitbucket**
     - Authorize AWS CodeBuild to access your Bitbucket account
   - For App Password:
     - Go to Bitbucket → **Personal settings** → **App passwords**
     - Create new app password with **Repositories: Read** permission
     - Copy the password
     - Back in AWS, select **Bitbucket credentials**
     - Enter Bitbucket username and app password
   - Repository URL: `https://bitbucket.org/yourusername/selenium-end-to-end-template`
   - Source version: `main` (or your default branch)

5. **Webhook** (Important for automatic triggers):
   - ✅ Check **Rebuild every time a code change is pushed to this repository**
   - Event type: **PUSH**
   - This creates a webhook in your Bitbucket repository automatically

6. **Environment**:
   - Environment image: **Managed image**
   - Operating system: **Ubuntu**
   - Runtime(s): **Standard**
   - Image: **aws/codebuild/standard:7.0** (includes Node.js 18)
   - Image version: **Always use the latest image for this runtime version**
   - Environment type: **Linux**
   - Privileged: ✅ **Enable** (required for Chrome installation)
   - Service role: **Existing service role** → Select `CodeBuildSeleniumTestsRole`
   - Timeout: **30 minutes** (adjust based on test duration)
   - Compute: **3 GB memory, 2 vCPUs** (minimum recommended)

7. **Buildspec**:
   - Build specifications: **Use a buildspec file**
   - Buildspec name: `buildspec.yml` (leave default)

8. **Batch configuration**: Skip

9. **Artifacts**:
   - Type: **Amazon S3**
   - Bucket name: `selenium-test-reports-v1`
   - Name: `test-results`
   - Path: `artifacts/`
   - Artifacts packaging: **Zip**

10. **Logs**:
    - ✅ CloudWatch logs - enabled
    - Group name: `/aws/codebuild/selenium-e2e-tests`
    - Stream name: Leave empty (auto-generated)

11. **Environment variables** (Important):
    Click **Add environment variable** and add these:
    
    | Name | Value | Type |
    |------|-------|------|
    | `REPORT_BUCKET` | `selenium-test-reports-v1` | Plaintext |
    | `AWS_REGION` | `ap-south-1` | Plaintext |
    | `BROWSER` | `chrome` | Plaintext |
    | `HEADLESS` | `true` | Plaintext |
    | `NODE_ENV` | `production` | Plaintext |

12. Click **Create build project**

### Step 4: Test Your Build

1. In CodeBuild project page, click **Start build**

2. **Source version**: Leave as `main` or specify branch

3. Click **Start build**

4. Monitor the build:
   - Watch the **Phase details** for progress
   - Click **Tail logs** to see real-time output
   - Build phases: SUBMITTED → QUEUED → PROVISIONING → DOWNLOAD_SOURCE → INSTALL → PRE_BUILD → BUILD → POST_BUILD → COMPLETED

5. Build should complete in 5-10 minutes

### Step 5: Create CodePipeline for Full Automation

1. Go to **AWS CodePipeline Console**: https://console.aws.amazon.com/codepipeline/

2. Click **Create pipeline**

3. **Pipeline settings**:
   - Pipeline name: `selenium-e2e-pipeline`
   - Service role: **New service role** (AWS will create it automatically)
   - Role name: `AWSCodePipelineServiceRole-selenium-e2e`
   - ✅ Allow AWS CodePipeline to create a service role
   - Advanced settings: Leave default
   - Artifact store: **Default location** (S3 bucket auto-created)
   - Click **Next**

4. **Add source stage**:
   - Source provider: **Bitbucket**
   - Connection: Click **Connect to Bitbucket**
     - Connection name: `bitbucket-selenium-tests`
     - Click **Connect to Bitbucket** → Authorize
   - Repository name: Select `yourusername/selenium-end-to-end-template`
   - Branch name: `main`
   - Output artifact format: **CodePipeline default**
   - Click **Next**

5. **Add build stage**:
   - Build provider: **AWS CodeBuild**
   - Region: Same as your project
   - Project name: **selenium-e2e-tests** (select from dropdown)
   - Build type: **Single build**
   - Click **Next**

6. **Add deploy stage**:
   - Click **Skip deploy stage** (not needed for tests)
   - Confirm skip

7. **Review**:
   - Review all settings
   - Click **Create pipeline**

8. Pipeline will automatically start the first execution

### Step 6: Configure Bitbucket Webhook (If Not Auto-Created)

If webhook wasn't created automatically:

1. Go to your **Bitbucket repository** → **Settings** → **Webhooks**

2. Click **Add webhook**
   - Title: `AWS CodePipeline Trigger`
   - URL: Get this from CodePipeline source configuration
   - Triggers: ✅ Repository push

3. Click **Save**

### Step 7: Verify Webhook in Bitbucket

1. Go to Bitbucket repository → **Settings** → **Webhooks**

2. You should see a webhook created by AWS CodeBuild or CodePipeline

3. Test the webhook:
   - Make a small change to your code
   - Commit and push to Bitbucket
   - Pipeline should trigger automatically within seconds

---

## Alternative: Bitbucket Pipelines with AWS

### When to Use Bitbucket Pipelines

Use this option if you:
- Prefer Bitbucket-native CI/CD
- Want simpler configuration
- Don't need AWS-specific integrations

### Setup

Create a file named `bitbucket-pipelines.yml` in your repository root:

```yaml
image: node:18

pipelines:
  default:
    - step:
        name: Install Dependencies
        caches:
          - node
        script:
          - npm install
          
    - step:
        name: Run E2E Tests
        script:
          # Install Chrome dependencies
          - apt-get update
          - apt-get install -y wget gnupg2 unzip
          
          # Install Chrome
          - wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
          - sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
          - apt-get update
          - apt-get install -y google-chrome-stable
          
          # Set environment variables
          - export BROWSER=chrome
          - export HEADLESS=true
          
          # Run tests
          - npm test
          
        artifacts:
          - allure-results/**
          - allure-report/**
          - screenshots/**
          
    - step:
        name: Generate Allure Report
        script:
          - npm run allure:generate
          
    - step:
        name: Upload Reports to S3 (Optional)
        script:
          - apt-get update && apt-get install -y awscli
          - aws s3 sync allure-report s3://$S3_BUCKET_NAME/reports/$(date +%Y%m%d-%H%M%S)/ --region $AWS_REGION
          
  branches:
    main:
      - step:
          name: Run Tests on Main Branch
          script:
            - npm install
            - npm test
            - npm run allure:generate
    
    develop:
      - step:
          name: Run Tests on Develop Branch
          script:
            - npm install
            - npm test

definitions:
  services:
    docker:
      memory: 2048
```

### Step 2: Configure Bitbucket Repository Variables

Go to your Bitbucket repository → Settings → Repository variables and add:

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key (secured)
- `AWS_REGION` - Your AWS region (e.g., us-east-1)
- `S3_BUCKET_NAME` - S3 bucket name for reports

### Step 3: Enable Bitbucket Pipelines

1. Go to your repository in Bitbucket
2. Navigate to **Pipelines** in the left sidebar
3. Click **Enable Pipelines**
4. Commit and push the `bitbucket-pipelines.yml` file

---

## Option 2: AWS CodePipeline + CodeBuild

This option provides more AWS integration and scalability.

### Architecture Overview

```
Bitbucket Repository → AWS CodePipeline → AWS CodeBuild → Run Tests → Store Results in S3
```

### Step 1: Create buildspec.yml

Create a file named `buildspec.yml` in your repository root:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo Installing Chrome and dependencies...
      - curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
      - echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
      - apt-get update
      - apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends
      - wget https://github.com/allure-framework/allure2/releases/download/2.25.0/allure-2.25.0.tgz
      - tar -zxvf allure-2.25.0.tgz -C /opt/
      - ln -s /opt/allure-2.25.0/bin/allure /usr/bin/allure
      
  pre_build:
    commands:
      - echo Installing NPM dependencies...
      - npm install
      - echo Setting environment variables...
      - export BROWSER=chrome
      - export HEADLESS=true
      - export DISPLAY=:99
      
  build:
    commands:
      - echo Running E2E tests...
      - npm test || true
      - echo Generating Allure report...
      - npm run allure:generate || true
      
  post_build:
    commands:
      - echo Tests completed
      - echo Uploading reports to S3...
      - aws s3 sync allure-report s3://${REPORT_BUCKET}/reports/$(date +%Y%m%d-%H%M%S)/ --region ${AWS_REGION}
      - aws s3 sync screenshots s3://${REPORT_BUCKET}/screenshots/$(date +%Y%m%d-%H%M%S)/ --region ${AWS_REGION}

artifacts:
  files:
    - allure-results/**/*
    - allure-report/**/*
    - screenshots/**/*
  name: selenium-test-results

cache:
  paths:
    - 'node_modules/**/*'
```

### Step 2: Set Up AWS CodeBuild Project

1. **Go to AWS CodeBuild Console**
   - Navigate to: https://console.aws.amazon.com/codebuild/

2. **Create Build Project**
   - Click **Create build project**
   - Project name: `selenium-e2e-tests`
   - Description: `Automated Selenium E2E tests`

3. **Source Configuration**
   - Source provider: **Bitbucket**
   - Repository: Connect your Bitbucket repository
   - Branch: `main` or `develop`
   - Webhook: Enable for automatic builds on push

4. **Environment Configuration**
   - Environment image: **Managed image**
   - Operating system: **Ubuntu**
   - Runtime: **Standard**
   - Image: `aws/codebuild/standard:7.0`
   - Environment type: **Linux**
   - Privileged: ✅ Enable (required for Docker)
   - Service role: Create new or use existing
   - Compute: 3 GB memory, 2 vCPUs (minimum recommended)

5. **Buildspec**
   - Build specifications: **Use a buildspec file**
   - Buildspec name: `buildspec.yml`

6. **Artifacts**
   - Type: **Amazon S3**
   - Bucket name: Your S3 bucket for reports
   - Path: `test-results/`

7. **Environment Variables**
   Add these environment variables:
   - `REPORT_BUCKET`: Your S3 bucket name
   - `AWS_REGION`: Your AWS region
   - `BROWSER`: chrome
   - `HEADLESS`: true

### Step 3: Set Up AWS CodePipeline

1. **Go to AWS CodePipeline Console**
   - Navigate to: https://console.aws.amazon.com/codepipeline/

2. **Create Pipeline**
   - Pipeline name: `selenium-e2e-pipeline`
   - Service role: Create new or use existing

3. **Add Source Stage**
   - Source provider: **Bitbucket**
   - Connection: Create new connection to Bitbucket
   - Repository: Select your repository
   - Branch: `main`
   - Output artifact format: **CodePipeline default**

4. **Add Build Stage**
   - Build provider: **AWS CodeBuild**
   - Project name: Select `selenium-e2e-tests`
   - Build type: **Single build**

5. **Skip Deploy Stage** (not needed for tests)

6. **Review and Create**

### Step 4: Create S3 Bucket for Reports

```bash
# Create S3 bucket
aws s3 mb s3://selenium-test-reports-your-company --region us-east-1

# Enable static website hosting for viewing HTML reports
aws s3 website s3://selenium-test-reports-your-company \
  --index-document index.html \
  --error-document error.html

# Set bucket policy for public read (for reports)
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::selenium-test-reports-your-company/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket selenium-test-reports-your-company \
  --policy file://bucket-policy.json
```

### Step 5: IAM Permissions

Your CodeBuild service role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::selenium-test-reports-your-company",
        "arn:aws:s3:::selenium-test-reports-your-company/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Option 3: GitHub Actions with AWS

If you migrate to GitHub, create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      env:
        BROWSER: chrome
        HEADLESS: true
      run: npm test
    
    - name: Generate Allure Report
      if: always()
      run: npm run allure:generate
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: allure-results
        path: allure-results/
    
    - name: Upload Allure report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: allure-report
        path: allure-report/
    
    - name: Upload screenshots
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: screenshots
        path: screenshots/
    
    - name: Configure AWS Credentials
      if: success()
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Upload reports to S3
      if: success()
      run: |
        aws s3 sync allure-report s3://${{ secrets.S3_BUCKET_NAME }}/reports/$(date +%Y%m%d-%H%M%S)/
```

---

## Running Tests in AWS Lambda (Serverless Option)

For cost-effective sporadic testing, you can use AWS Lambda with Selenium.

### Create Lambda Layer with Chrome

```bash
# Create layer
mkdir chrome-layer
cd chrome-layer

# Download Chrome for Lambda
wget https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-57/stable-headless-chromium-amazonlinux-2.zip
unzip stable-headless-chromium-amazonlinux-2.zip

# Create layer structure
mkdir -p python/lib/python3.9/site-packages
pip install selenium chromedriver-autoinstaller -t python/lib/python3.9/site-packages/

# Create zip
zip -r chrome-selenium-layer.zip .

# Upload to AWS Lambda Layer
aws lambda publish-layer-version \
  --layer-name chrome-selenium \
  --zip-file fileb://chrome-selenium-layer.zip \
  --compatible-runtimes python3.9
```

---

## Viewing Test Reports

### Option 1: S3 Static Website

Access your reports at:
```
http://selenium-test-reports-your-company.s3-website-us-east-1.amazonaws.com/reports/TIMESTAMP/index.html
```

### Option 2: CloudFront Distribution

Create CloudFront distribution for HTTPS access:

```bash
aws cloudfront create-distribution \
  --origin-domain-name selenium-test-reports-your-company.s3.amazonaws.com \
  --default-root-object index.html
```

### Option 3: Allure Report Server on EC2

Deploy Allure Report server for persistent reports:

```bash
# Launch EC2 instance (t2.micro for testing)
# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start

# Run Allure Report server
docker run -d -p 5050:5050 \
  -e CHECK_RESULTS_EVERY_SECONDS=5 \
  -v $(pwd)/allure-results:/app/allure-results \
  -v $(pwd)/allure-reports:/app/default-reports \
  frankescobar/allure-docker-service
```

---

## Notifications

### SNS Notifications for Test Results

Create SNS topic and subscribe:

```bash
# Create topic
aws sns create-topic --name selenium-test-notifications

# Subscribe email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT_ID:selenium-test-notifications \
  --protocol email \
  --notification-endpoint your-email@example.com

# Add to buildspec.yml post_build:
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT_ID:selenium-test-notifications \
  --subject "E2E Tests Completed" \
  --message "Test execution completed. Report: http://your-s3-url/reports/latest/"
```

---

## Cost Optimization Tips

1. **Use Spot Instances** for CodeBuild to reduce costs
2. **Set S3 Lifecycle Policies** to delete old reports after 30 days
3. **Use Lambda** for infrequent test runs
4. **Enable caching** in CodeBuild for node_modules
5. **Run tests in parallel** to reduce build time

---

## Troubleshooting

### Chrome/ChromeDriver Version Mismatch
```bash
# In buildspec.yml, add version checking:
- google-chrome --version
- chromedriver --version
```

### Out of Memory Issues
- Increase CodeBuild compute resources
- Add `--disable-dev-shm-usage` to Chrome options

### Test Timeouts
- Increase Jest timeout in package.json
- Set CodeBuild timeout to 30+ minutes

---

## Next Steps

1. Choose your CI/CD option (Bitbucket Pipelines recommended)
2. Set up AWS resources (S3 bucket, IAM roles)
3. Configure repository secrets
4. Push configuration files
5. Monitor first pipeline run
6. Set up notifications
7. Document report access for team

## Support

For issues:
- Check AWS CodeBuild logs
- Review Bitbucket Pipeline logs
- Verify IAM permissions
- Check S3 bucket policies


