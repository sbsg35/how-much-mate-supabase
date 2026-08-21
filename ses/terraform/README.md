# Amazon SES Configuration

This Terraform configuration sets up Amazon SES (Simple Email Service) for howmuchmate.com.au.

## Configuration

### Identity Details

- **Email Address**: hello@howmuchmate.com.au
- **Sending Domain**: howmuchmate.com.au
- **MAIL FROM Domain**: no-reply.howmuchmate.com.au
- **Behavior on MX Failure**: Use default MAIL FROM domain

### Deliverability & Tracking

- **Virtual Deliverability Manager**: Enabled
- **Engagement Tracking**: Enabled
- **Optimized Shared Delivery**: Enabled

### Infrastructure & Multi-tenancy

- **Dedicated IP Pool**: Disabled
- **Tenant Management**: Disabled

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform >= 1.0.0
3. Access to DNS management for howmuchmate.com.au

## Environment Note

This configuration is for **production only**. Development uses Mailtrap instead of SES.

## Usage

### Initialize Terraform

```bash
terraform init
```

### Plan Changes

```bash
terraform plan -var-file="tfvars.prod"
```

### Apply Changes

```bash
terraform apply -var-file="tfvars.prod"
```

## DNS Configuration

After applying the Terraform configuration, you need to add DNS records for verification and authentication. Run:

```bash
terraform output dns_records
```

This will display all required DNS records including:

- Domain verification TXT record
- DKIM CNAME records (3 records)
- MAIL FROM MX record
- SPF TXT records
- DMARC TXT record

### Manual DNS Setup

If `create_route53_records` is set to `false` (default), you'll need to manually add these DNS records to your DNS provider.

### Automatic DNS Setup

If you're using Route53, set `create_route53_records = true` and provide `route53_zone_id` in your tfvars file.

## SMTP Credentials

To send emails via SMTP, you'll need to create SMTP credentials in the AWS Console:

1. Go to SES Console
2. Navigate to "SMTP settings"
3. Create SMTP credentials
4. Use the SMTP endpoint from `terraform output ses_smtp_endpoint`

## Verification

1. **Email Verification**: AWS will send a verification email to hello@howmuchmate.com.au. Click the link to verify.
2. **Domain Verification**: Add the DNS records and wait for AWS to verify (usually within 72 hours).
3. **DKIM Verification**: DKIM records will be automatically verified once DNS propagates.

## Moving Out of Sandbox

New SES accounts start in sandbox mode with limitations:

- Can only send to verified email addresses
- Limited sending quota

To move to production:

1. Go to AWS SES Console
2. Request production access
3. Provide use case details
4. Wait for AWS approval (usually 24 hours)

## Monitoring

The configuration includes CloudWatch metrics for:

- Send events
- Delivery events
- Bounce events
- Complaint events
- Open events
- Click events

Access these in CloudWatch Console under SES metrics.

## Configuration Set

The configuration set `howmuchmate-{env}-config-set` should be used when sending emails to enable tracking and deliverability features.

## Resources Created

- SES Domain Identity (howmuchmate.com.au)
- SES Email Identity (hello@howmuchmate.com.au)
- MAIL FROM Domain configuration
- DKIM authentication
- Configuration Set with engagement tracking
- VDM (Virtual Deliverability Manager) settings
- Optional Route53 DNS records

## Security Notes

- TLS is required for all email delivery
- SPF and DKIM are configured for email authentication
- DMARC policy is set to quarantine for additional security
- No dedicated IPs (using shared AWS IP pool)


### AWS PROFILE
for this:

`export AWS_PROFILE=ssgh920`