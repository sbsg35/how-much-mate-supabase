import "server-only";

import { env } from "@/libs/envlib";

const environment = env.APP_ENV;

console.log("=======APP_ENV:====", environment);
const environmentConfig = {
    local: {
        frontendUrl: "http://localhost:3000",
        smtpHost: "127.0.0.1",
        smtpPort: 54325,
        smtpSecure: false,
        user: "",
    },
    dev: {
        frontendUrl: "https://dev.howmuchmate.com.au",
        smtpHost: "sandbox.smtp.mailtrap.io",
        user: "ee076af183dc09",
        smtpPort: 587,
        smtpSecure: false,
    },
    prod: {
        frontendUrl: "https://howmuchmate.com.au",
        smtpHost: process.env.SMTP_HOST,
        smtpPort: 587,
        smtpSecure: false,
        user: "",
    },
};

const selectedConfig = environmentConfig[environment];

export function getAppConfig() {
    return {
        frontendUrl: selectedConfig.frontendUrl,
        smtp: {
            host: selectedConfig.smtpHost,
            port: selectedConfig.smtpPort,
            secure: selectedConfig.smtpSecure,
            user: selectedConfig.user,
            pass: environment === "local" ? undefined : env.SMTP_PASS,
            fromEmail: "hello@howmuchmate.com.au",
            fromName: "How Much Mate",
            reviewToEmail: "hello@howmuchmate.com.au",
        },
    };
}
