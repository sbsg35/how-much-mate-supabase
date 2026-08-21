resource "cloudflare_turnstile_widget" "quote_submission" {
  account_id      = "dbfaf1b0a2d27291c581768013a0f46f"
  bot_fight_mode  = false
  clearance_level = "no_clearance"
  domains         = ["127.0.0.1", "howmuchmate.com.au", "localhost"]
  ephemeral_id    = false
  mode            = "managed"
  name            = "howmuchmate bot protection"
  offlabel        = false
  region          = "world"
}

