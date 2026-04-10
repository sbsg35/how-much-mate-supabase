"use client";
import Script from "next/script";

export const Turnstile = () => {
  return (
    <>
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => {
          // Dispatch a custom event when the script loads
          window.dispatchEvent(new Event("turnstileLoaded"));
        }}
      />
    </>
  );
};
