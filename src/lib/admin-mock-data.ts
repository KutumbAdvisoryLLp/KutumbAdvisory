import {
  featuredStory,
  latestInsights,
  editorPicks,
  type JournalArticle,
} from "./journal-data";

// ---------------------------------------------------------------------------
// Leads (contact form submissions)
// ---------------------------------------------------------------------------

export type LeadStatus = "new" | "contacted" | "scheduled" | "closed";

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  ageGroup: string;
  contactAs: string;
  primaryGoal: string;
  preferredMeeting: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: LeadStatus;
  submittedAt: string;
}

export const initialLeads: Lead[] = [
  {
    id: "lead-1",
    fullName: "Vikram Rathore",
    email: "vikram.rathore@example.com",
    phone: "+91 98200 11223",
    city: "Delhi",
    occupation: "Business Owner",
    ageGroup: "41–50",
    contactAs: "Business Owner",
    primaryGoal: "Estate Planning",
    preferredMeeting: "Office",
    preferredDate: "2026-08-04",
    preferredTime: "11:00",
    notes: "Looking to structure succession plan for two manufacturing units before his son joins the business.",
    status: "scheduled",
    submittedAt: "2026-07-22T09:14:00+05:30",
  },
  {
    id: "lead-2",
    fullName: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 90112 44556",
    city: "Pune",
    occupation: "Marketing Director",
    ageGroup: "30–40",
    contactAs: "Couple",
    primaryGoal: "Financial Kundali",
    preferredMeeting: "Online",
    preferredDate: "2026-08-01",
    preferredTime: "18:30",
    notes: "Wants a joint session with her husband to map their combined finances.",
    status: "contacted",
    submittedAt: "2026-07-24T14:02:00+05:30",
  },
  {
    id: "lead-3",
    fullName: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 99887 65432",
    city: "Bengaluru",
    occupation: "Software Architect",
    ageGroup: "30–40",
    contactAs: "Individual",
    primaryGoal: "Investment Planning",
    preferredMeeting: "Online",
    preferredDate: "",
    preferredTime: "",
    notes: "Has RSUs vesting from three companies, wants a consolidated view.",
    status: "new",
    submittedAt: "2026-07-27T08:41:00+05:30",
  },
  {
    id: "lead-4",
    fullName: "Priya & Rohan Deshmukh",
    email: "priya.deshmukh@example.com",
    phone: "+91 98765 12340",
    city: "Mumbai",
    occupation: "Doctors",
    ageGroup: "41–50",
    contactAs: "Family",
    primaryGoal: "Legacy Planning",
    preferredMeeting: "Office",
    preferredDate: "2026-08-06",
    preferredTime: "16:00",
    notes: "Two children studying abroad, want to set up an education + legacy trust.",
    status: "scheduled",
    submittedAt: "2026-07-20T11:30:00+05:30",
  },
  {
    id: "lead-5",
    fullName: "Sanjay Iyer",
    email: "sanjay.iyer@example.com",
    phone: "+91 97025 88990",
    city: "Chennai",
    occupation: "Retired Bank Manager",
    ageGroup: "60+",
    contactAs: "Individual",
    primaryGoal: "Retirement",
    preferredMeeting: "Office",
    preferredDate: "",
    preferredTime: "",
    notes: "Wants to review pension corpus allocation post-retirement.",
    status: "closed",
    submittedAt: "2026-07-10T10:05:00+05:30",
  },
  {
    id: "lead-6",
    fullName: "Fatima Sheikh",
    email: "fatima.sheikh@example.com",
    phone: "+91 96543 21098",
    city: "Hyderabad",
    occupation: "Startup Founder",
    ageGroup: "30–40",
    contactAs: "Business Owner",
    primaryGoal: "Tax",
    preferredMeeting: "Online",
    preferredDate: "2026-08-02",
    preferredTime: "19:00",
    notes: "ESOP taxation questions ahead of Series B.",
    status: "new",
    submittedAt: "2026-07-26T17:22:00+05:30",
  },
  {
    id: "lead-7",
    fullName: "Karan Malhotra",
    email: "karan.malhotra@example.com",
    phone: "+91 98111 33445",
    city: "Chandigarh",
    occupation: "Real Estate Developer",
    ageGroup: "51–60",
    contactAs: "Individual",
    primaryGoal: "Insurance",
    preferredMeeting: "Office",
    preferredDate: "2026-07-31",
    preferredTime: "12:30",
    notes: "Coverage review after a health scare earlier this year.",
    status: "contacted",
    submittedAt: "2026-07-21T13:50:00+05:30",
  },
  {
    id: "lead-8",
    fullName: "Ritu & Aman Chopra",
    email: "ritu.chopra@example.com",
    phone: "+91 90909 87654",
    city: "Gurugram",
    occupation: "Corporate Lawyer & CA",
    ageGroup: "30–40",
    contactAs: "Couple",
    primaryGoal: "Financial Kundali",
    preferredMeeting: "Online",
    preferredDate: "2026-08-05",
    preferredTime: "20:00",
    notes: "Recently married, want to build a combined financial plan from scratch.",
    status: "new",
    submittedAt: "2026-07-28T09:03:00+05:30",
  },
  {
    id: "lead-9",
    fullName: "Devansh Oberoi",
    email: "devansh.oberoi@example.com",
    phone: "+91 99223 44778",
    city: "Jaipur",
    occupation: "Hotelier",
    ageGroup: "41–50",
    contactAs: "Business Owner",
    primaryGoal: "Estate Planning",
    preferredMeeting: "Office",
    preferredDate: "",
    preferredTime: "",
    notes: "Family-owned heritage hotel chain, three siblings involved in ownership.",
    status: "closed",
    submittedAt: "2026-07-05T15:40:00+05:30",
  },
  {
    id: "lead-10",
    fullName: "Meera Pillai",
    email: "meera.pillai@example.com",
    phone: "+91 91234 56789",
    city: "Kochi",
    occupation: "Freelance Consultant",
    ageGroup: "Under 30",
    contactAs: "Individual",
    primaryGoal: "Other",
    preferredMeeting: "Online",
    preferredDate: "2026-08-03",
    preferredTime: "17:00",
    notes: "Irregular income, wants help building a cashflow buffer strategy.",
    status: "contacted",
    submittedAt: "2026-07-25T19:18:00+05:30",
  },
];

// ---------------------------------------------------------------------------
// Newsletter subscribers
// ---------------------------------------------------------------------------

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

const subscriberSeed: [string, string][] = [
  ["ananya.rao@example.com", "2026-07-27T10:12:00+05:30"],
  ["rahul.bansal@example.com", "2026-07-26T08:45:00+05:30"],
  ["shreya.gupta@example.com", "2026-07-26T21:03:00+05:30"],
  ["vivek.nair@example.com", "2026-07-25T13:37:00+05:30"],
  ["ishita.sharma@example.com", "2026-07-24T09:20:00+05:30"],
  ["aditya.kulkarni@example.com", "2026-07-23T18:52:00+05:30"],
  ["pooja.reddy@example.com", "2026-07-22T11:10:00+05:30"],
  ["nikhil.saxena@example.com", "2026-07-21T15:29:00+05:30"],
  ["divya.menon@example.com", "2026-07-20T07:58:00+05:30"],
  ["harshvardhan.singh@example.com", "2026-07-19T20:14:00+05:30"],
  ["kavya.iyer@example.com", "2026-07-18T12:41:00+05:30"],
  ["siddharth.joshi@example.com", "2026-07-17T16:05:00+05:30"],
  ["tara.chatterjee@example.com", "2026-07-15T09:47:00+05:30"],
  ["rohan.verma@example.com", "2026-07-14T14:23:00+05:30"],
  ["ayesha.khan@example.com", "2026-07-12T10:36:00+05:30"],
  ["manish.agarwal@example.com", "2026-07-10T19:02:00+05:30"],
  ["lavanya.pillai@example.com", "2026-07-08T08:15:00+05:30"],
  ["yash.thakur@example.com", "2026-07-05T17:48:00+05:30"],
];

export const initialSubscribers: Subscriber[] = subscriberSeed.map(
  ([email, subscribedAt], i) => ({
    id: `sub-${i + 1}`,
    email,
    subscribedAt,
  })
);

// ---------------------------------------------------------------------------
// Journal articles
// ---------------------------------------------------------------------------

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  featured: boolean;
  published: boolean;
}

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

function toAdminArticle(
  article: JournalArticle,
  overrides: Partial<AdminArticle> = {}
): AdminArticle {
  return {
    id: article.id,
    title: article.title,
    slug: slugify(article.title),
    coverImage: "",
    category: article.category,
    author: article.author,
    excerpt: article.excerpt,
    content: article.excerpt,
    readTime: article.readTime,
    date: article.date,
    featured: !!article.featured,
    published: true,
    ...overrides,
  };
}

export const initialArticles: AdminArticle[] = [
  toAdminArticle(featuredStory),
  ...latestInsights.map((a, i) =>
    toAdminArticle(a, i >= 4 ? { published: false } : {})
  ),
  ...editorPicks.map((a, i) =>
    toAdminArticle(a, i === 2 ? { published: false } : {})
  ),
];

// ---------------------------------------------------------------------------
// Analytics mock data
// ---------------------------------------------------------------------------

export const pageViewsData = [
  { date: "Jul 14", views: 1240 },
  { date: "Jul 15", views: 1380 },
  { date: "Jul 16", views: 1190 },
  { date: "Jul 17", views: 1520 },
  { date: "Jul 18", views: 1610 },
  { date: "Jul 19", views: 1340 },
  { date: "Jul 20", views: 1280 },
  { date: "Jul 21", views: 1710 },
  { date: "Jul 22", views: 1890 },
  { date: "Jul 23", views: 1760 },
  { date: "Jul 24", views: 2010 },
  { date: "Jul 25", views: 2140 },
  { date: "Jul 26", views: 1980 },
  { date: "Jul 27", views: 2260 },
];

export const topPagesData = [
  { page: "/", views: 8420 },
  { page: "/journal", views: 3110 },
  { page: "/about", views: 2480 },
  { page: "/contact", views: 1960 },
  { page: "/mykundali", views: 1420 },
];

export const leadsOverTimeData = [
  { date: "Jul 14", leads: 3 },
  { date: "Jul 15", leads: 5 },
  { date: "Jul 16", leads: 2 },
  { date: "Jul 17", leads: 6 },
  { date: "Jul 18", leads: 4 },
  { date: "Jul 19", leads: 3 },
  { date: "Jul 20", leads: 7 },
  { date: "Jul 21", leads: 5 },
  { date: "Jul 22", leads: 8 },
  { date: "Jul 23", leads: 6 },
  { date: "Jul 24", leads: 9 },
  { date: "Jul 25", leads: 7 },
  { date: "Jul 26", leads: 5 },
  { date: "Jul 27", leads: 10 },
];

export const trafficSourcesData = [
  { source: "Organic Search", value: 42 },
  { source: "Direct", value: 26 },
  { source: "Social", value: 18 },
  { source: "Referral", value: 9 },
  { source: "Email", value: 5 },
];
