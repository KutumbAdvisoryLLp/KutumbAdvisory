// Only these email providers are accepted for MyKundali account signup.
export const ALLOWED_EMAIL_DOMAINS = new Set([
  // Gmail
  "gmail.com",
  "googlemail.com",
  // Outlook / Microsoft
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  // Yahoo Mail
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "rocketmail.com",
  // AOL Mail
  "aol.com",
  // iCloud Mail
  "icloud.com",
  "me.com",
  "mac.com",
  // Proton Mail
  "proton.me",
  "protonmail.com",
  "pm.me",
  // Tuta
  "tuta.com",
  "tutanota.com",
  "tuta.io",
  // Hushmail
  "hushmail.com",
  // Posteo
  "posteo.de",
  "posteo.net",
  // Zoho Mail
  "zoho.com",
  "zohomail.com",
  "zoho.in",
  // Fastmail
  "fastmail.com",
  "fastmail.fm",
  // Mail.com
  "mail.com",
  // GMX Mail
  "gmx.com",
  "gmx.net",
  "gmx.de",
  "gmx.at",
  "gmx.ch",
]);

export const ALLOWED_EMAIL_PROVIDERS_LABEL =
  "Gmail, Outlook, Yahoo Mail, AOL Mail, iCloud Mail, Proton Mail, Tuta, Hushmail, Posteo, Zoho Mail, Fastmail, Mail.com, or GMX Mail";

export function isAllowedEmailDomain(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  return !!domain && ALLOWED_EMAIL_DOMAINS.has(domain);
}
