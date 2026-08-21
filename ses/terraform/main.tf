# Domain Identity
resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

# Domain Identity Verification (manual via Namecheap DNS)
# Verification will happen automatically once DNS records are added to Namecheap

# DKIM Tokens
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

# Email Identity
resource "aws_ses_email_identity" "hello" {
  email = var.email_address
}

# MAIL FROM Domain
resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = var.mail_from_domain

  behavior_on_mx_failure = "UseDefaultValue"
}

# Configuration Set with Engagement Tracking
resource "aws_ses_configuration_set" "main" {
  name = "${var.label}-${var.env_name}-config-set"

  delivery_options {
    tls_policy = "Require"
  }

  reputation_metrics_enabled = true
}

# Event Destination for Engagement Tracking
resource "aws_ses_event_destination" "engagement" {
  name                   = "${var.label}-${var.env_name}-engagement"
  configuration_set_name = aws_ses_configuration_set.main.name
  enabled                = true
  matching_types         = ["send", "reject", "bounce", "complaint", "delivery", "open", "click"]

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:configuration-set"
    value_source   = "messageTag"
  }
}

# Virtual Deliverability Manager (VDM) Attributes
resource "aws_sesv2_account_vdm_attributes" "main" {
  vdm_enabled = "ENABLED"

  dashboard_attributes {
    engagement_metrics = "ENABLED"
  }

  guardian_attributes {
    optimized_shared_delivery = "ENABLED"
  }
}

# IAM User for SMTP Authentication
resource "aws_iam_user" "smtp" {
  name = "${var.label}-${var.env_name}-smtp-user"
  path = "/ses/"

  tags = {
    Name        = "${var.label}-${var.env_name}-smtp-user"
    Environment = var.env_name
    Purpose     = "SES SMTP Authentication"
  }
}

# IAM Policy for SES Sending
resource "aws_iam_user_policy" "smtp_send" {
  name = "${var.label}-${var.env_name}-ses-smtp-policy"
  user = aws_iam_user.smtp.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM Access Key for SMTP (WARNING: Sensitive output)
resource "aws_iam_access_key" "smtp" {
  user = aws_iam_user.smtp.name
}

# DNS records are managed externally in Namecheap
# Use 'terraform output dns_records' to get the records to add manually
