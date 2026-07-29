export interface JournalArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const featuredStory: JournalArticle = {
  id: "featured-1",
  title: "The Architecture of Family Wealth: Why Most Financial Plans Fail Within a Generation",
  excerpt:
    "A deep exploration of why traditional financial planning rarely survives generational transitions and how a connected architectural approach changes everything.",
  category: "Wealth Philosophy",
  author: "Kutumb Advisory",
  date: "June 2026",
  readTime: "12 min read",
  featured: true,
};

export const latestInsights: JournalArticle[] = [
  {
    id: "insight-1",
    title: "The Nine Grahas: Understanding Your Financial Kundali",
    excerpt:
      "An introduction to the nine dimensions of family wealth and how mapping them reveals connections traditional planning misses.",
    category: "Financial Kundali",
    author: "Kutumb Advisory",
    date: "May 2026",
    readTime: "8 min read",
  },
  {
    id: "insight-2",
    title: "Protection First: Why Insurance Should Be Your Foundation, Not an Afterthought",
    excerpt:
      "Most families buy insurance backwards. A framework for building protection that actually serves your family's long-term wealth.",
    category: "Insurance",
    author: "Kutumb Advisory",
    date: "May 2026",
    readTime: "6 min read",
  },
  {
    id: "insight-3",
    title: "Beyond the Spreadsheet: What Estate Planning Teaches Us About Family",
    excerpt:
      "Estate planning is not about documents. It is about ensuring your values outlive your assets across generations.",
    category: "Estate Planning",
    author: "Kutumb Advisory",
    date: "April 2026",
    readTime: "10 min read",
  },
  {
    id: "insight-4",
    title: "The Cost of Complexity: How Fragmented Finances Erode Family Wealth",
    excerpt:
      "Every disconnected account, every uncoordinated advisor, every unplanned gap quietly chips away at your family's financial future.",
    category: "Wealth Management",
    author: "Kutumb Advisory",
    date: "April 2026",
    readTime: "7 min read",
  },
  {
    id: "insight-5",
    title: "Generational Wealth Is Not About Money. It Is About Architecture.",
    excerpt:
      "The families that preserve wealth across generations share one thing in common: they build systems, not just portfolios.",
    category: "Wealth Philosophy",
    author: "Kutumb Advisory",
    date: "March 2026",
    readTime: "9 min read",
  },
  {
    id: "insight-6",
    title: "Tax Strategy as a Family Value: Planning Beyond This Year's Return",
    excerpt:
      "The most tax-efficient families think in decades, not financial years. A framework for multi-generational tax architecture.",
    category: "Tax Planning",
    author: "Kutumb Advisory",
    date: "March 2026",
    readTime: "6 min read",
  },
];

export const categories = [
  { name: "Investment", icon: "investment", count: "12 articles" },
  { name: "Insurance", icon: "insurance", count: "8 articles" },
  { name: "Retirement", icon: "retirement", count: "6 articles" },
  { name: "Estate Planning", icon: "estate", count: "9 articles" },
  { name: "Tax", icon: "tax", count: "7 articles" },
  { name: "Business", icon: "business", count: "5 articles" },
  { name: "Legacy", icon: "legacy", count: "10 articles" },
  { name: "Family Wealth", icon: "family", count: "14 articles" },
];

export const editorPicks: JournalArticle[] = [
  {
    id: "pick-1",
    title: "What Swiss Private Banks Taught Us About Family Wealth",
    excerpt:
      "Timeless principles from the world's most trusted wealth institutions — adapted for Indian families.",
    category: "Wealth Philosophy",
    author: "Kutumb Advisory",
    date: "February 2026",
    readTime: "14 min read",
  },
  {
    id: "pick-2",
    title: "The Hidden Gaps in Most Family Insurance Portfolios",
    excerpt:
      "A systematic review of the most overlooked protection gaps we see across four hundred families.",
    category: "Insurance",
    author: "Kutumb Advisory",
    date: "February 2026",
    readTime: "8 min read",
  },
  {
    id: "pick-3",
    title: "Raising Wealth-Wise Children: A Guide for Indian Families",
    excerpt:
      "How to prepare the next generation to manage, grow and protect family wealth with confidence and purpose.",
    category: "Family Wealth",
    author: "Kutumb Advisory",
    date: "January 2026",
    readTime: "11 min read",
  },
];

export interface FinancialGuide {
  id: string;
  title: string;
  desc: string;
  pages: string;
  icon: string;
}

export const financialGuides: FinancialGuide[] = [
  {
    id: "guide-1",
    title: "Estate Planning Checklist",
    desc: "A comprehensive checklist to ensure your family's estate plan covers every essential element.",
    pages: "12 pages",
    icon: "estate",
  },
  {
    id: "guide-2",
    title: "Insurance Review Guide",
    desc: "Step-by-step framework to evaluate your family's insurance coverage and identify gaps.",
    pages: "16 pages",
    icon: "insurance",
  },
  {
    id: "guide-3",
    title: "Retirement Planning Guide",
    desc: "Build a retirement plan that preserves your lifestyle and supports your family's future.",
    pages: "20 pages",
    icon: "retirement",
  },
  {
    id: "guide-4",
    title: "Financial Documents Checklist",
    desc: "Keep every essential financial document organised and accessible for your family.",
    pages: "8 pages",
    icon: "documents",
  },
  {
    id: "guide-5",
    title: "Investment Starter Guide",
    desc: "A principled introduction to building a family investment portfolio that lasts generations.",
    pages: "24 pages",
    icon: "investment",
  },
];
