export const journalCategories = [
  "Investment",
  "Insurance",
  "Retirement",
  "Estate Planning",
  "Tax",
  "Business",
  "Legacy",
  "Family Wealth",
  "Wealth Philosophy",
  "Financial Kundali",
  "Wealth Management",
  "Tax Planning",
];

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
