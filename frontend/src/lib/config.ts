import "server-only";

const environment = process.env.APP_ENV ?? "local";

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
        smtpPort: 2525,
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

if (!(environment in environmentConfig)) {
    throw new Error(`Invalid APP_ENV: ${environment}`);
}

const selectedConfig =
    environmentConfig[environment as keyof typeof environmentConfig];

export function getAppConfig() {
    return {
        frontendUrl: process.env.APP_URL ?? selectedConfig.frontendUrl,
        smtp: {
            host: selectedConfig.smtpHost,
            port: selectedConfig.smtpPort,
            secure: selectedConfig.smtpSecure,
            user: selectedConfig.user,
            pass: process.env.SMTP_PASS,
            fromEmail: "hello@howmuchmate.com.au",
            fromName: "How Much Mate",
            reviewToEmail: "hello@howmuchmate.com.au",
        },
    };
}
