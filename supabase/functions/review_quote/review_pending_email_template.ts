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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderReviewPendingEmailMjml(
  params: ReviewPendingEmailTemplateParams,
) {
  const description = escapeHtml(params.descriptionHtml).replaceAll(
    "\n",
    "<br />",
  );

  return `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Georgia, serif" />
          <mj-text color="#1b1b18" font-size="16px" line-height="1.6" />
          <mj-button
            font-weight="700"
            font-size="16px"
            inner-padding="14px 22px"
            border-radius="0"
          />
        </mj-attributes>
        <mj-title>Quote pending review</mj-title>
        <mj-preview>A quote has been set to pending and needs moderation.</mj-preview>
      </mj-head>
      <mj-body background-color="#f5f1e8">
        <mj-section padding="24px 16px 0">
          <mj-column
            background-color="#fffaf1"
            border="1px solid #d5ccb8"
            border-bottom="none"
            padding="20px"
          >
            <mj-text
              font-size="12px"
              color="#7b6f58"
              text-transform="uppercase"
              letter-spacing="1.5px"
            >
              How Much Mate moderation
            </mj-text>
            <mj-text
              font-size="30px"
              line-height="1.2"
              font-weight="700"
              padding-top="0"
            >
              Quote pending review
            </mj-text>
            <mj-text>
              This quote was automatically set to pending and needs a decision.
            </mj-text>

            <mj-text container-background-color="#f8ecdf" padding="10px 14px">
              <div style="border-left:4px solid #b85c38;padding-left:10px;">
                <p style="margin:0 0 4px;font-size:12px;color:#8a5a2d;text-transform:uppercase;letter-spacing:1px;">Why it was set to pending</p>
                <p style="margin:0;font-size:18px;line-height:1.4;">${
    escapeHtml(params.reviewReason)
  }</p>
              </div>
            </mj-text>

            <mj-divider border-color="#eadfca" border-width="1px" />
            <mj-table>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Quote ID</td>
                <td style="padding:8px 0;font-family:monospace;font-size:13px;">${
    escapeHtml(params.quoteId)
  }</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Title</td>
                <td style="padding:8px 0;">${escapeHtml(params.title)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Business</td>
                <td style="padding:8px 0;">${
    escapeHtml(params.businessName)
  }</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Category</td>
                <td style="padding:8px 0;">${
    escapeHtml(params.categoryName)
  }</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Price</td>
                <td style="padding:8px 0;">${escapeHtml(params.price)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Location</td>
                <td style="padding:8px 0;">${escapeHtml(params.location)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">User email</td>
                <td style="padding:8px 0;">${escapeHtml(params.userEmail)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Quote date</td>
                <td style="padding:8px 0;">${escapeHtml(params.quoteDate)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;vertical-align:top;width:160px;">Review source</td>
                <td style="padding:8px 0;">${
    escapeHtml(params.reviewSource)
  }</td>
              </tr>
            </mj-table>

            <mj-divider border-color="#eadfca" border-width="1px" />
            <mj-text
              font-size="12px"
              color="#7b6f58"
              text-transform="uppercase"
              letter-spacing="1px"
              padding-bottom="4px"
            >
              Description
            </mj-text>
            <mj-text padding-top="0">${description}</mj-text>
          </mj-column>
        </mj-section>
        <mj-section padding="0 16px 24px">
          <mj-column
            width="50%"
            background-color="#fffaf1"
            border="1px solid #d5ccb8"
            border-top="none"
            border-right="none"
            padding="16px 20px"
          >
            <mj-button
              href="${escapeHtml(params.publishUrl)}"
              background-color="#25633b"
              align="left"
            >
              Publish quote
            </mj-button>
          </mj-column>
          <mj-column
            width="50%"
            background-color="#fffaf1"
            border="1px solid #d5ccb8"
            border-top="none"
            padding="16px 20px"
          >
            <mj-button
              href="${escapeHtml(params.flaggedUrl)}"
              background-color="#7a1f1f"
              align="right"
            >
              Mark as flagged
            </mj-button>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;
}
