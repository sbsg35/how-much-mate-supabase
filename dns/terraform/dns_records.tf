resource "cloudflare_dns_record" "api_dev_a" {
  comment  = "API dev endpoint"
  content  = "194.195.251.94"
  name     = "api-dev.howmuchmate.com.au"
  proxied  = true
  tags     = []
  ttl      = 1
  type     = "A"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "ses_dkim_1_cname" {
  comment = "DKIM for AWS SES"
  content = "5gq3im3vhzje6h6jl5uyynrggylbcu3z.dkim.amazonses.com"
  name    = "5gq3im3vhzje6h6jl5uyynrggylbcu3z._domainkey.howmuchmate.com.au"
  proxied = false
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "dev_cname" {
  content = "edb87b04817eca3d.vercel-dns-017.com"
  name    = "dev.howmuchmate.com.au"
  proxied = false
  tags    = []
  ttl     = 60
  type    = "CNAME"
  zone_id = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "root_cname" {
  content = "edb87b04817eca3d.vercel-dns-017.com"
  name    = "howmuchmate.com.au"
  proxied = false
  tags    = []
  ttl     = 60
  type    = "CNAME"
  zone_id = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "ses_dkim_2_cname" {
  comment = "DKIM for AWS SES"
  content = "khthmc2srbwgpeynswwdgh5tmub46uye.dkim.amazonses.com"
  name    = "khthmc2srbwgpeynswwdgh5tmub46uye._domainkey.howmuchmate.com.au"
  proxied = false
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "www_cname" {
  content = "edb87b04817eca3d.vercel-dns-017.com"
  name    = "www.howmuchmate.com.au"
  proxied = false
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "ses_dkim_3_cname" {
  comment = "DKIM for AWS SES"
  content = "zoas4bu7lngr7bn2qjfagu3w6oufq3ai.dkim.amazonses.com"
  name    = "zoas4bu7lngr7bn2qjfagu3w6oufq3ai._domainkey.howmuchmate.com.au"
  proxied = false
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "google_mx_alt4" {
  comment  = "Google MX alternate 4"
  content  = "alt4.aspmx.l.google.com"
  name     = "howmuchmate.com.au"
  priority = 10
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "MX"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "google_mx_alt3" {
  comment  = "Google MX alternate 3"
  content  = "alt3.aspmx.l.google.com"
  name     = "howmuchmate.com.au"
  priority = 10
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "MX"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "google_mx_primary" {
  comment  = "Primary Google MX"
  content  = "aspmx.l.google.com"
  name     = "howmuchmate.com.au"
  priority = 1
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "MX"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "google_mx_alt1" {
  comment  = "Google MX alternate 1"
  content  = "alt1.aspmx.l.google.com"
  name     = "howmuchmate.com.au"
  priority = 5
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "MX"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "google_mx_alt2" {
  comment  = "Google MX alternate 2"
  content  = "alt2.aspmx.l.google.com"
  name     = "howmuchmate.com.au"
  priority = 5
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "MX"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "ses_no_reply_mx" {
  comment  = "AWS SES for no-reply"
  content  = "feedback-smtp.ap-southeast-2.amazonses.com"
  name     = "no-reply.howmuchmate.com.au"
  priority = 10
  proxied  = false
  tags     = []
  ttl      = 1
  type     = "MX"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "dmarc_txt" {
  comment  = "DMARC policy"
  content  = "v=DMARC1; p=none; rua=mailto:hello@howmuchmate.com.au; fo=1;"
  name     = "_dmarc.howmuchmate.com.au"
  proxied  = false
  tags     = []
  ttl      = 1
  type     = "TXT"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "google_site_verification_txt" {
  comment  = "Google site verification"
  content  = "google-site-verification=Dt9aoNnubxq6lunf9VIF231EoOsKG7HQfzRl2izqYd4"
  name     = "howmuchmate.com.au"
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "TXT"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "google_spf_txt" {
  comment  = "SPF record for Google"
  content  = "v=spf1 include:_spf.google.com -all"
  name     = "howmuchmate.com.au"
  proxied  = false
  tags     = []
  ttl      = 3600
  type     = "TXT"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "ses_no_reply_spf_txt" {
  comment  = "SPF record for AWS SES"
  content  = "v=spf1 include:amazonses.com ~all"
  name     = "no-reply.howmuchmate.com.au"
  proxied  = false
  tags     = []
  ttl      = 1
  type     = "TXT"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "vercel_verify_dev_txt" {
  content  = "\"vc-domain-verify=dev.howmuchmate.com.au,a8fe532064e5efc392d7,dc\""
  name     = "_vercel.howmuchmate.com.au"
  proxied  = false
  tags     = []
  ttl      = 600
  type     = "TXT"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

resource "cloudflare_dns_record" "vercel_verify_www_txt" {
  content  = "\"vc-domain-verify=www.howmuchmate.com.au,d79af07e7271d0d90031,dc\""
  name     = "_vercel.howmuchmate.com.au"
  proxied  = false
  tags     = []
  ttl      = 600
  type     = "TXT"
  zone_id  = "c8f9d88bf45065c42f454f7c6bd15468"
  settings = {}
}

