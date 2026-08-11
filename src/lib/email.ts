import { Resend } from "resend";

const FROM = process.env.NEWSLETTER_FROM_EMAIL || "hello@kutumbadvisory.com";
const FROM_NAME = "Kutumb Advisory";

// Lazily instantiated so Next.js doesn't evaluate it at build time
// (process.env.RESEND_API_KEY would be undefined during static analysis).
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// ─── Shared HTML wrapper ───────────────────────────────────────────
function wrap(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Kutumb Advisory</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f4f4f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${preheader ? `<div style="display:none;overflow:hidden;max-height:0;max-width:0;opacity:0;visibility:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f2;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#172A4A;border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#D7A52E;">KUTUMB ADVISORY</p>
            <p style="margin:8px 0 0;font-size:22px;font-weight:400;color:#ffffff;letter-spacing:0.01em;">Family Wealth Management</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f8f6;border:1px solid #e8e6e1;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#888888;">
              Kutumb Advisory LLP · Family Wealth Management
            </p>
            <p style="margin:0 0 8px;font-size:12px;color:#888888;">
              <a href="https://www.kutumbadvisory.com" style="color:#A8791F;text-decoration:none;">www.kutumbadvisory.com</a>
              &nbsp;·&nbsp;
              <a href="mailto:hello@kutumbadvisory.com" style="color:#A8791F;text-decoration:none;">hello@kutumbadvisory.com</a>
            </p>
            <p style="margin:0;font-size:11px;color:#aaaaaa;">
              You received this because you subscribed to Kutumb Advisory updates.
              <br />
              <a href="{{unsubscribe_url}}" style="color:#aaaaaa;text-decoration:underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── 1. Newsletter broadcast ────────────────────────────────────────
export function buildNewsletterHtml(subject: string, body: string): string {
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#333333;">${p.replace(/\n/g, "<br/>")}</p>`
    )
    .join("");

  return wrap(
    `
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:600;color:#172A4A;line-height:1.3;">${subject}</h1>
    ${paragraphs}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
      <tr><td align="center">
        <a href="https://www.kutumbadvisory.com" style="display:inline-block;background:#172A4A;color:#ffffff;font-size:14px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
          Visit Kutumb Advisory →
        </a>
      </td></tr>
    </table>
    `,
    subject
  );
}

// ─── 2. Welcome email (on signup) ───────────────────────────────────
export function buildWelcomeHtml(name: string): string {
  const firstName = name.split(" ")[0] || name;
  return wrap(
    `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:600;color:#172A4A;">Welcome to Kutumb Advisory, ${firstName} 🙏</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">We're honoured to have you take the first step towards understanding and strengthening your family's financial health.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f7f3;border-radius:10px;padding:24px;margin-bottom:28px;">
      <tr><td>
        <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#172A4A;text-transform:uppercase;letter-spacing:0.08em;">Your Next Steps</p>
        <p style="margin:0 0 10px;font-size:14px;color:#333333;line-height:1.6;">✦ &nbsp;Complete your <strong>Family Profile</strong> — tell us about your household</p>
        <p style="margin:0 0 10px;font-size:14px;color:#333333;line-height:1.6;">✦ &nbsp;Answer the <strong>9-Graha Assessment</strong> — takes less than 5 minutes</p>
        <p style="margin:0;font-size:14px;color:#333333;line-height:1.6;">✦ &nbsp;Get your <strong>Financial Kundali</strong> — your personalised wealth blueprint</p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td align="center">
        <a href="https://www.kutumbadvisory.com/mykundali/assessment/landing" style="display:inline-block;background:#D7A52E;color:#ffffff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
          Start My Assessment →
        </a>
      </td></tr>
    </table>

    <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">If you have any questions, just reply to this email — we respond to every message.</p>
    <p style="margin:12px 0 0;font-size:13px;color:#888888;">With warmth,<br/><strong style="color:#172A4A;">The Kutumb Advisory Team</strong></p>
    `,
    `Welcome! Your Financial Kundali journey starts here.`
  );
}

// ─── 3. Payment confirmation email ──────────────────────────────────
export function buildPaymentConfirmationHtml(name: string, amount: number, orderId: string): string {
  const firstName = name.split(" ")[0] || name;
  const amountStr = `₹${(amount / 100).toLocaleString("en-IN")}`;
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return wrap(
    `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:56px;height:56px;background:#e8f5e9;border-radius:50%;line-height:56px;font-size:28px;text-align:center;">✓</div>
    </div>

    <h1 style="margin:0 0 8px;font-size:24px;font-weight:600;color:#172A4A;text-align:center;">Payment Confirmed!</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.6;text-align:center;">Thank you, ${firstName}. Your Financial Kundali is now unlocked.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f7f3;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <tr>
        <td style="font-size:13px;color:#888888;padding:6px 0;">Amount Paid</td>
        <td style="font-size:14px;font-weight:700;color:#172A4A;text-align:right;padding:6px 0;">${amountStr}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#888888;padding:6px 0;border-top:1px solid #e8e6e1;">Order ID</td>
        <td style="font-size:13px;font-family:monospace;color:#555555;text-align:right;padding:6px 0;border-top:1px solid #e8e6e1;">${orderId}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#888888;padding:6px 0;border-top:1px solid #e8e6e1;">Date</td>
        <td style="font-size:13px;color:#555555;text-align:right;padding:6px 0;border-top:1px solid #e8e6e1;">${date}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#888888;padding:6px 0;border-top:1px solid #e8e6e1;">Product</td>
        <td style="font-size:13px;color:#555555;text-align:right;padding:6px 0;border-top:1px solid #e8e6e1;">Financial Kundali — Full Access (Lifetime)</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td align="center">
        <a href="https://www.kutumbadvisory.com/mykundali/dashboard/reports" style="display:inline-block;background:#172A4A;color:#ffffff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
          View My Dashboard →
        </a>
      </td></tr>
    </table>

    <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
      Questions about your purchase? Reply to this email or write to us at
      <a href="mailto:hello@kutumbadvisory.com" style="color:#A8791F;">hello@kutumbadvisory.com</a>
    </p>
    `,
    `Your Financial Kundali is now unlocked — payment confirmed.`
  );
}

// ─── 4. Password Reset OTP email ──────────────────────────────────────
export function buildPasswordResetOtpHtml(otp: string): string {
  return wrap(
    `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:600;color:#172A4A;text-align:center;">Password Reset Request</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;text-align:center;">Use the 6-digit verification code below to reset your Kutumb Advisory account password.</p>

    <div style="text-align:center;margin:32px 0;">
      <div style="display:inline-block;background:#172A4A;color:#D7A52E;font-size:32px;font-weight:700;letter-spacing:0.35em;padding:16px 36px;border-radius:12px;font-family:monospace;">
        ${otp}
      </div>
    </div>

    <p style="margin:0 0 16px;font-size:13px;color:#666666;text-align:center;line-height:1.5;">This verification code will expire in 15 minutes.</p>
    <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;text-align:center;">If you did not request a password reset, please ignore this email.</p>
    `,
    `Your password reset verification code is ${otp}`
  );
}

// ─── Sender utilities ────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  return getResend().emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: "Welcome to Kutumb Advisory — Your Journey Begins ✦",
    html: buildWelcomeHtml(name),
  });
}

export async function sendPasswordResetOtpEmail(to: string, otp: string) {
  return getResend().emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: `${otp} is your Kutumb Advisory password reset code`,
    html: buildPasswordResetOtpHtml(otp),
  });
}

export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  amountPaise: number,
  orderId: string
) {
  return getResend().emails.send({
    from: `${FROM_NAME} <${FROM}>`,
    to,
    subject: "Payment Confirmed — Financial Kundali Unlocked ✓",
    html: buildPaymentConfirmationHtml(name, amountPaise, orderId),
  });
}

export async function sendNewsletterBatch(
  recipients: string[],
  subject: string,
  body: string
): Promise<{ sent: number; error?: string }> {
  const BATCH_SIZE = 100;
  const html = buildNewsletterHtml(subject, body);

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const { error } = await getResend().batch.send(
      batch.map((to) => ({ from: `${FROM_NAME} <${FROM}>`, to, subject, html }))
    );
    if (error) return { sent: i, error: error.message };
  }

  return { sent: recipients.length };
}
