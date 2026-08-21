output "domain_identity_arn" {
  description = "ARN of the SES domain identity"
  value       = aws_ses_domain_identity.main.arn
}

output "domain_identity_verification_token" {
  description = "Verification token for domain identity"
  value       = aws_ses_domain_identity.main.verification_token
}

output "email_identity_arn" {
  description = "ARN of the SES email identity"
  value       = aws_ses_email_identity.hello.arn
}

output "dkim_tokens" {
  description = "DKIM tokens for domain verification"
  value       = aws_ses_domain_dkim.main.dkim_tokens
}

output "mail_from_domain" {
  description = "MAIL FROM domain"
  value       = aws_ses_domain_mail_from.main.mail_from_domain
}

output "configuration_set_name" {
  description = "Name of the SES configuration set"
  value       = aws_ses_configuration_set.main.name
}

output "configuration_set_arn" {
  description = "ARN of the SES configuration set"
  value       = aws_ses_configuration_set.main.arn
}

output "ses_smtp_endpoint" {
  description = "SES SMTP endpoint"
  value       = "email-smtp.${var.aws_region}.amazonaws.com"
}

output "smtp_username" {
  description = "SMTP username (IAM Access Key ID)"
  value       = aws_iam_access_key.smtp.id
}

output "smtp_password" {
  description = "SMTP password (derived from IAM Secret Access Key) - SENSITIVE"
  value       = aws_iam_access_key.smtp.ses_smtp_password_v4
  sensitive   = true
}

output "smtp_port" {
  description = "SMTP ports (use 587 for STARTTLS or 465 for TLS)"
  value       = "587 (STARTTLS) or 465 (TLS Wrapper)"
}

output "dns_records" {
  description = "DNS records to add for SES verification"
  value = {
    verification = {
      name  = "_amazonses.${var.domain_name}"
      type  = "TXT"
      value = aws_ses_domain_identity.main.verification_token
    }
    dkim = [
      for token in aws_ses_domain_dkim.main.dkim_tokens : {
        name  = "${token}._domainkey.${var.domain_name}"
        type  = "CNAME"
        value = "${token}.dkim.amazonses.com"
      }
    ]
    mail_from_mx = {
      name  = var.mail_from_domain
      type  = "MX"
      value = "10 feedback-smtp.${var.aws_region}.amazonses.com"
    }
    mail_from_spf = {
      name  = var.mail_from_domain
      type  = "TXT"
      value = "v=spf1 include:amazonses.com ~all"
    }
    domain_spf = {
      name  = var.domain_name
      type  = "TXT"
      value = "v=spf1 include:amazonses.com ~all"
    }
    dmarc = {
      name  = "_dmarc.${var.domain_name}"
      type  = "TXT"
      value = "v=DMARC1; p=quarantine; rua=mailto:${var.dmarc_rua_email}"
    }
  }
}
