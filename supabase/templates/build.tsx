import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { render } from "@react-email/render";
import React from "react";
import { ConfirmationEmail } from "./src/confirmation";
import { MagicLinkEmail } from "./src/magic-link";
import { RecoveryEmail } from "./src/recovery";

const templatesDirectory = join(process.cwd(), "supabase", "templates");

async function build() {
  await mkdir(templatesDirectory, { recursive: true });

  const templates = [
    ["magic-link.html", <MagicLinkEmail />],
    ["confirmation.html", <ConfirmationEmail />],
    ["recovery.html", <RecoveryEmail />],
  ] as const;

  await Promise.all(
    templates.map(async ([filename, component]) => {
      const html = await render(component, { pretty: true });
      await writeFile(join(templatesDirectory, filename), html);
      console.log(`Rendered ${filename}`);
    }),
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
