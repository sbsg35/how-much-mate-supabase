import React, { type CSSProperties } from "react";
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

export type ReviewPendingEmailTemplateParams = {
  quoteId: string;
  reviewReason: string;
  title: string;
  businessName: string;
  categoryName: string;
  price: string;
  location: string;
  userEmail: string;
  quoteDate: string;
  reviewSource: string;
  descriptionHtml: string;
  publishUrl: string;
  flaggedUrl: string;
};

export function ReviewPendingEmail(params: ReviewPendingEmailTemplateParams) {
  const details = [
    ["Quote ID", params.quoteId],
    ["Business", params.businessName],
    ["Category", params.categoryName],
    ["Price", params.price],
    ["Location", params.location],
    ["Submitted by", params.userEmail],
    ["Quote date", params.quoteDate],
    ["Review source", params.reviewSource],
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>A quote is waiting for a moderation decision.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>HowMuchMate?</Text>
            <Text style={brandSubtitle}>Community pricing for everyday services</Text>
            <Heading style={heading}>Quote pending review</Heading>
            <Text style={intro}>A community submission needs your decision.</Text>
          </Section>
          <Section style={content}>
            <Section style={reasonBox}>
              <Text style={label}>Why it was held</Text>
              <Text style={reason}>{params.reviewReason}</Text>
            </Section>
            <Heading as="h2" style={quoteTitle}>{params.title}</Heading>
            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
              <tbody>
                {details.map(([name, value]) => (
                  <tr key={name}>
                    <td style={detailLabel}>{name}</td>
                    <td style={detailValue}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Hr style={divider} />
            <Text style={label}>Description</Text>
            <Text style={description}>{params.descriptionHtml}</Text>
            <Section style={actions}>
              <Button href={params.publishUrl} style={{ ...button, backgroundColor: "#198755", marginRight: "10px" }}>
                Publish quote
              </Button>
              <Button href={params.flaggedUrl} style={{ ...button, backgroundColor: "#495057" }}>
                Mark as flagged
              </Button>
            </Section>
            <Text style={note}>These links are single-use and expire in seven days.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: CSSProperties = { backgroundColor: "#f8f9fa", color: "#343a40", fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: "28px 12px" };
const container: CSSProperties = { backgroundColor: "#ffffff", border: "1px solid #dee2e6", borderRadius: "8px", boxShadow: "0 4px 14px rgba(33, 37, 41, 0.07)", maxWidth: "640px", overflow: "hidden" };
const header: CSSProperties = { borderBottom: "1px solid #dee2e6", padding: "24px 34px 25px" };
const brand: CSSProperties = { color: "#198755", fontFamily: "'Courier New', monospace", fontSize: "16px", fontWeight: 800, margin: 0 };
const brandSubtitle: CSSProperties = { color: "#868e96", fontSize: "12px", margin: "3px 0 24px" };
const heading: CSSProperties = { color: "#212529", fontSize: "27px", fontWeight: 600, lineHeight: 1.25, margin: "0 0 8px" };
const intro: CSSProperties = { color: "#495057", fontSize: "15px", margin: 0 };
const content: CSSProperties = { padding: "30px 34px 32px" };
const reasonBox: CSSProperties = { backgroundColor: "#fff4e6", borderLeft: "4px solid #f76707", borderRadius: "6px", marginBottom: "26px", padding: "14px 18px" };
const label: CSSProperties = { color: "#868e96", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", margin: "0 0 6px", textTransform: "uppercase" };
const reason: CSSProperties = { color: "#d9480f", fontSize: "16px", fontWeight: 600, lineHeight: 1.45, margin: 0 };
const quoteTitle: CSSProperties = { color: "#198755", fontSize: "20px", fontWeight: 600, margin: "0 0 15px" };
const detailLabel: CSSProperties = { borderBottom: "1px solid #e9ecef", color: "#868e96", fontSize: "13px", fontWeight: 700, padding: "9px 12px 9px 0", verticalAlign: "top", width: "135px" };
const detailValue: CSSProperties = { borderBottom: "1px solid #e9ecef", color: "#343a40", fontSize: "14px", padding: "9px 0", verticalAlign: "top" };
const divider: CSSProperties = { borderColor: "#dee2e6", margin: "27px 0" };
const description: CSSProperties = { color: "#495057", fontSize: "15px", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" };
const actions: CSSProperties = { marginTop: "28px" };
const button: CSSProperties = { borderRadius: "7px", color: "#ffffff", fontSize: "14px", fontWeight: 700, padding: "13px 18px", textDecoration: "none" };
const note: CSSProperties = { color: "#868e96", fontSize: "11px", margin: "17px 0 0" };
