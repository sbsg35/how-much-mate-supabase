import React, { type CSSProperties } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type AuthEmailLayoutProps = {
  eyebrow: string;
  title: string;
  preview: string;
  message: string;
  buttonLabel: string;
  buttonHref: string;
  tokenPrompt?: string;
  token?: string;
  footer: string;
};

export function AuthEmailLayout(props: AuthEmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{props.preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={brandBand}>
            <table role="presentation" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={logoMark}>$?</td>
                  <td style={brandCopy}>
                    <Text style={brand}>HowMuchMate?</Text>
                    <Text style={tagline}>Community pricing for everyday services</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Section style={content}>
            <Text style={eyebrow}>{props.eyebrow}</Text>
            <Heading style={heading}>{props.title}</Heading>
            <Text style={copy}>{props.message}</Text>
            <Button href={props.buttonHref} style={button}>
              {props.buttonLabel}
            </Button>
            {props.tokenPrompt && props.token ? (
              <Section style={codePanel}>
                <Text style={codeLabel}>{props.tokenPrompt}</Text>
                <Text style={code}>{props.token}</Text>
              </Section>
            ) : null}
            <Text style={securityNote}>
              🔒 This secure link
              {props.token ? " and code expire soon. " : " expires soon. "}
              How Much Mate will never ask you to forward this email.
            </Text>
          </Section>
          <Section style={footerSection}>
            <Text style={footerText}>{props.footer}</Text>
            <Text style={footerBrand}>HowMuchMate? · Australia</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: CSSProperties = {
  backgroundColor: "#f8f9fa",
  color: "#343a40",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "32px 12px",
};
const container: CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #dee2e6",
  borderRadius: "8px",
  boxShadow: "0 4px 14px rgba(33, 37, 41, 0.07)",
  maxWidth: "560px",
  overflow: "hidden",
};
const brandBand: CSSProperties = {
  borderBottom: "1px solid #dee2e6",
  padding: "20px 28px",
};
const logoMark: CSSProperties = {
  backgroundColor: "#23bd78",
  borderRadius: "50%",
  color: "#ffffff",
  fontFamily: "'Courier New', monospace",
  fontSize: "13px",
  fontWeight: 800,
  height: "36px",
  textAlign: "center",
  width: "36px",
};
const brandCopy: CSSProperties = { paddingLeft: "9px" };
const brand: CSSProperties = {
  color: "#198755",
  fontFamily: "'Courier New', monospace",
  fontSize: "15px",
  fontWeight: 800,
  margin: 0,
};
const tagline: CSSProperties = {
  color: "#868e96",
  fontSize: "12px",
  margin: "3px 0 0",
};
const content: CSSProperties = { padding: "34px 36px 30px" };
const eyebrow: CSSProperties = {
  color: "#198755",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1px",
  margin: "0 0 10px",
  textTransform: "uppercase",
};
const heading: CSSProperties = {
  color: "#212529",
  fontSize: "27px",
  fontWeight: 600,
  lineHeight: 1.25,
  margin: "0 0 14px",
};
const copy: CSSProperties = {
  color: "#495057",
  fontSize: "15px",
  lineHeight: 1.6,
  margin: "0 0 24px",
};
const button: CSSProperties = {
  backgroundColor: "#198755",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 700,
  padding: "13px 22px",
  textDecoration: "none",
};
const codePanel: CSSProperties = {
  backgroundColor: "#f5fdf9",
  border: "1px solid #c6f5e0",
  borderRadius: "8px",
  marginTop: "28px",
  padding: "18px 20px 14px",
  textAlign: "center",
};
const codeLabel: CSSProperties = {
  color: "#495057",
  fontSize: "11px",
  fontWeight: 700,
  margin: "0 0 7px",
  textTransform: "uppercase",
};
const code: CSSProperties = {
  color: "#198755",
  fontFamily: "'Courier New', monospace",
  fontSize: "30px",
  fontWeight: 700,
  letterSpacing: "7px",
  margin: 0,
};
const securityNote: CSSProperties = {
  color: "#868e96",
  fontSize: "12px",
  lineHeight: 1.6,
  margin: "20px 0 0",
};
const footerSection: CSSProperties = {
  backgroundColor: "#f8f9fa",
  borderTop: "1px solid #dee2e6",
  padding: "20px 36px 24px",
};
const footerText: CSSProperties = {
  color: "#868e96",
  fontSize: "12px",
  lineHeight: 1.55,
  margin: "0 0 10px",
};
const footerBrand: CSSProperties = {
  color: "#adb5bd",
  fontFamily: "'Courier New', monospace",
  fontSize: "10px",
  fontWeight: 700,
  margin: 0,
};
