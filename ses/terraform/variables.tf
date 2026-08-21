variable "aws_region" {
  description = "AWS region for SES"
  type        = string
  default     = "ap-southeast-2"
}

variable "label" {
  description = "Label prefix for resources"
  type        = string
  default     = "howmuchmate"
}

variable "env_name" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Sending domain for SES"
  type        = string
  default     = "howmuchmate.com.au"
}

variable "email_address" {
  description = "Email address to verify"
  type        = string
  default     = "hello@howmuchmate.com.au"
}

variable "mail_from_domain" {
  description = "MAIL FROM domain"
  type        = string
  default     = "no-reply.howmuchmate.com.au"
}

variable "dmarc_rua_email" {
  description = "Email address for DMARC aggregate reports"
  type        = string
  default     = "dmarc@howmuchmate.com.au"
}

variable "tags" {
  description = "Additional tags for resources"
  type        = list(string)
  default     = ["ses", "email"]
}
