const environment = process.env.NEXT_PUBLIC_APP_ENV ?? "local";

const environmentConfig = {
    local: {
        frontendUrl: "http://localhost:3000",
        supabaseUrl: "http://127.0.0.1:54321",
        smtpHost: "127.0.0.1",
        smtpPort: 54325,
        smtpSecure: false,
        user: "",
    },
    dev: {
        frontendUrl: "https://dev.howmuchmate.com.au",
        supabaseUrl: "https://ghhzavhcgldjqdanjxgp.supabase.co",
        smtpHost: "sandbox.smtp.mailtrap.io",
        user: "ee076af183dc09",
        smtpPort: 587,
        smtpSecure: false,
    },
    prod: {
        frontendUrl: "https://howmuchmate.com.au",
        supabaseUrl: "https://azcljaelnifkgxfefkvu.supabase.co",
        smtpHost: "sandbox.smtp.mailtrap.io",
        user: "ee076af183dc09",
        smtpPort: 587,
        smtpSecure: false,
    },
};

if (!(environment in environmentConfig)) {
    throw new Error(`Invalid NEXT_PUBLIC_APP_ENV: ${environment}`);
}

const selectedConfig = environmentConfig[
    environment as keyof typeof environmentConfig
];

export function getAppConfig() {
    return {
        frontendUrl: selectedConfig.frontendUrl,
        supabaseUrl: selectedConfig.supabaseUrl,
        smtp: {
            host: selectedConfig.smtpHost,
            port: selectedConfig.smtpPort,
            secure: selectedConfig.smtpSecure,
            user: selectedConfig.user,
            pass: environment === "local" ? undefined : process.env.SMTP_PASS,
            fromEmail: "hello@howmuchmate.com.au",
            fromName: "How Much Mate",
            reviewToEmail: "hello@howmuchmate.com.au",
        },
    };
}
