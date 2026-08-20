import type { CSSProperties } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ReviewPendingEmailProps = {
  quoteId: string;
  reviewReason: string;
  title: string;
  businessName: string;
  categoryName: string;
  price: string;
  location: string;
  userEmail: string;
  quoteYear: string;
  reviewSource: string;
  description: string;
  publishUrl: string;
  flaggedUrl: string;
};

export function ReviewPendingEmail(props: ReviewPendingEmailProps) {
  const details = [
    ["Quote ID", props.quoteId],
    ["Business", props.businessName],
    ["Category", props.categoryName],
    ["Price", props.price],
    ["Location", props.location],
    ["Submitted by", props.userEmail],
    ["Quote year", props.quoteYear],
    ["Review source", props.reviewSource],
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>A quote is waiting for a moderation decision.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.brandBand}>
            <table role="presentation" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={styles.logoMark}>$?</td>
                  <td style={styles.brandCopy}>
                    <Text style={styles.brandName}>How Much</Text>
                    <Text style={styles.brandMate}>Mate</Text>
                    <Text style={styles.brandSubtitle}>
                      Community pricing for everyday services
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Section style={styles.content}>
            <Text style={styles.eyebrow}>Moderation required</Text>
            <Heading style={styles.heading}>Quote pending review</Heading>
            <Text style={styles.intro}>
              A community submission needs your decision.
            </Text>
            <Section style={styles.reasonBox}>
              <Text style={styles.label}>Why it was held</Text>
              <Text style={styles.reason}>{props.reviewReason}</Text>
            </Section>
            <Heading as="h2" style={styles.quoteTitle}>
              {props.title}
            </Heading>
            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
              <tbody>
                {details.map(([name, value]) => (
                  <tr key={name}>
                    <td style={styles.detailLabel}>{name}</td>
                    <td style={styles.detailValue}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Hr style={styles.divider} />
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{props.description}</Text>
            <Section style={styles.actions}>
              <Button
                href={props.publishUrl}
                style={{
                  ...styles.button,
                  backgroundColor: "#198755",
                  marginRight: "10px",
                }}
              >
                Publish quote
              </Button>
              <Button
                href={props.flaggedUrl}
                style={{ ...styles.button, backgroundColor: "#495057" }}
              >
                Mark as flagged
              </Button>
            </Section>
            <Text style={styles.note}>
              These links are single-use and expire in seven days.
            </Text>
          </Section>
          <Section style={styles.footerSection}>
            <Text style={styles.footerText}>
              This moderation email is intended for authorised How Much Mate
              reviewers only.
            </Text>
            <Text style={styles.footerBrand}>HowMuchMate? · Australia</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "28px 12px",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    boxShadow: "0 4px 14px rgba(33, 37, 41, 0.07)",
    maxWidth: "560px",
    overflow: "hidden",
  },
  brandBand: { borderBottom: "1px solid #dee2e6", padding: "16px 28px" },
  logoMark: {
    backgroundColor: "#23bd78",
    borderRadius: "50%",
    color: "#ffffff",
    fontFamily: "'Courier New', monospace",
    fontSize: "13px",
    fontWeight: 800,
    height: "36px",
    textAlign: "center",
    width: "36px",
  },
  brandCopy: { paddingLeft: "9px" },
  brandName: {
    color: "#111111",
    fontSize: "15px",
    fontWeight: 800,
    lineHeight: 1,
    margin: 0,
  },
  brandMate: {
    color: "#198755",
    fontSize: "15px",
    fontWeight: 800,
    lineHeight: 1,
    margin: "2px 0 0",
  },
  brandSubtitle: {
    color: "#868e96",
    fontSize: "11px",
    lineHeight: 1.2,
    margin: "4px 0 0",
  },
  eyebrow: {
    color: "#198755",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1px",
    margin: "0 0 10px",
    textTransform: "uppercase",
  },
  heading: {
    color: "#212529",
    fontSize: "27px",
    fontWeight: 600,
    lineHeight: 1.25,
    margin: "0 0 8px",
  },
  intro: { color: "#495057", fontSize: "15px", margin: "0 0 24px" },
  content: { padding: "34px 36px 30px" },
  reasonBox: {
    backgroundColor: "#fff4e6",
    borderLeft: "4px solid #f76707",
    borderRadius: "6px",
    marginBottom: "26px",
    padding: "14px 18px",
  },
  label: {
    color: "#868e96",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1px",
    margin: "0 0 6px",
    textTransform: "uppercase",
  },
  reason: {
    color: "#d9480f",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.45,
    margin: 0,
  },
  quoteTitle: {
    color: "#198755",
    fontSize: "20px",
    fontWeight: 600,
    margin: "0 0 15px",
  },
  detailLabel: {
    borderBottom: "1px solid #e9ecef",
    color: "#868e96",
    fontSize: "13px",
    fontWeight: 700,
    padding: "9px 12px 9px 0",
    verticalAlign: "top",
    width: "135px",
  },
  detailValue: {
    borderBottom: "1px solid #e9ecef",
    color: "#343a40",
    fontSize: "14px",
    padding: "9px 0",
    verticalAlign: "top",
  },
  divider: { borderColor: "#dee2e6", margin: "27px 0" },
  description: {
    color: "#495057",
    fontSize: "15px",
    lineHeight: 1.65,
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  actions: { marginTop: "28px" },
  button: {
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    padding: "13px 18px",
    textDecoration: "none",
  },
  note: { color: "#868e96", fontSize: "11px", margin: "17px 0 0" },
  footerSection: {
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #dee2e6",
    padding: "20px 36px 24px",
  },
  footerText: {
    color: "#868e96",
    fontSize: "12px",
    lineHeight: 1.55,
    margin: "0 0 10px",
  },
  footerBrand: {
    color: "#adb5bd",
    fontFamily: "'Courier New', monospace",
    fontSize: "10px",
    fontWeight: 700,
    margin: 0,
  },
};
