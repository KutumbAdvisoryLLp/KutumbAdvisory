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

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

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

export interface NewsletterSend {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string | null;
  recipientCount: number;
}
