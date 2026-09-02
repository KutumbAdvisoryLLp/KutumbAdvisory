// Single source of truth for canonical site identity — used by layout
// metadata, sitemap.ts, robots.ts, and structured data. Keeps the domain
// from drifting out of sync across files the way it previously could
// (email.ts hardcodes its own copy for HTML email links, which is fine
// since emails are a separate rendering context).
export const SITE_URL = "https://www.kutumbadvisory.com";
export const SITE_NAME = "Kutumb Advisory";
export const SITE_LOGO_URL =
  "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780312133/tree_qw9bji.png";
export const CONTACT_EMAIL = "hello@kutumbadvisory.com";
export const CONTACT_PHONE = "+91 98316 10210";
export const SOCIAL_LINKS = [
  "https://www.instagram.com/kutumb_advisory",
  "https://in.linkedin.com/in/deepika-jha-1a07a63a8",
];
