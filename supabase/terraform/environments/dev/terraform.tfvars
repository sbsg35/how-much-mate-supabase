project_name    = "how-much-mate-dev"
organization_id = "cgdugjxdoazkaftxuluf"
region          = "ap-southeast-2"
auth_settings = {
  site_url                      = "https://dev.howmuchmate.com.au"
  additional_redirect_urls      = ["https://dev.howmuchmate.com.au/auth/callback", "http://localhost:3000/auth/callback"]
  enable_refresh_token_rotation = true
  enable_signup                 = true
  enable_anonymous_sign_ins     = false
  minimum_password_length       = 8
  security_captcha_enabled      = true
  security_captcha_provider     = "turnstile"
  security_captcha_secret       = "1x0000000000000000000000000000000AA"
  external_google_client_id     = "778035252919-s5c65jm6ksfbktq2uho6llghqn1pfidf.apps.googleusercontent.com"
  external_google_enabled       = true
}
