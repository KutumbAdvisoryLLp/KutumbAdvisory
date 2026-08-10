-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  KUTUMB ADVISORY — DATABASE SEED DATA (FILE 2/2: SEED DATA)        ║
-- ║  Populates fresh initial content for Site Settings, Announcements,  ║
-- ║  Team Members, Testimonials, FAQs, and Journal Articles.           ║
-- ║  Run this AFTER 0001_schema.sql.                                   ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ═══════════════════════════════════════════════════════════════════
-- 1. SITE CONFIGURATION & SETTINGS
-- ═══════════════════════════════════════════════════════════════════
insert into public.admin_users (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'hello@kutumbadvisory.com'
on conflict (id) do nothing;

insert into public.site_settings (key, value)
values
  ('company', '{
    "name": "Kutumb Advisory",
    "phone": "+91 98316 10210",
    "email": "hello@kutumbadvisory.com",
    "address": "Kutumb Advisory Services, Financial District, Mumbai, Maharashtra 400051",
    "social": {
      "linkedin": "https://linkedin.com/company/kutumbadvisory",
      "twitter": "https://twitter.com/kutumbadvisory",
      "youtube": "https://youtube.com/@kutumbadvisory",
      "instagram": "https://instagram.com/kutumbadvisory"
    }
  }'::jsonb)
on conflict (key) do update set value = excluded.value;

-- ═══════════════════════════════════════════════════════════════════
-- 2. ANNOUNCEMENT BANNERS
-- ═══════════════════════════════════════════════════════════════════
insert into public.announcements (message, link_text, link_url, bg_color, text_color, is_active)
values
  ('✦ Start your 9-Graha Financial Kundali assessment today & gain complete visibility over family wealth.', 'Explore Toolkit →', '/toolkit', 'bg-navy', 'text-gold', true);

-- ═══════════════════════════════════════════════════════════════════
-- 3. TEAM & LEADERSHIP MEMBERS
-- ═══════════════════════════════════════════════════════════════════
insert into public.team_members (name, role, bio, image_url, linkedin_url, is_founder, display_order)
values
  (
    'Deepika',
    'Founder & Principal Advisor',
    'With over 12 years of experience in wealth management and private banking, Deepika founded Kutumb Advisory to bring structural clarity to Indian family finances. She specializes in 9-Graha wealth architecture, multi-generational trust design, and holistic risk management.',
    'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780300586/deepika-founder_u8eiuz.jpg',
    'https://linkedin.com/in/deepika-kutumb',
    true,
    1
  ),
  (
    'Rajesh Sharma',
    'Head of Wealth Architecture',
    'Chartered Accountant with 15+ years advising business families on tax optimization, estate succession, and corporate asset structuring.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://linkedin.com',
    false,
    2
  ),
  (
    'Ananya Iyer',
    'Lead Family Risk Specialist',
    'Certified Financial Planner with deep expertise in emergency corpus planning, insurance protection design, and health security frameworks.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'https://linkedin.com',
    false,
    3
  );

-- ═══════════════════════════════════════════════════════════════════
-- 4. CLIENT TESTIMONIALS
-- ═══════════════════════════════════════════════════════════════════
insert into public.testimonials (name, location, role, quote, avatar_url, rating, is_featured, display_order)
values
  (
    'Vikram Mehta',
    'Mumbai',
    'Tech Entrepreneur & Business Owner',
    'Financial Kundali completely transformed how my wife and I view our family wealth. We went from scattered investments across five platforms to a single, crystal-clear 9-graha dashboard.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    5,
    true,
    1
  ),
  (
    'Priya & Suresh Kulkarni',
    'Bengaluru',
    'Senior Corporate Executives',
    'The 90-Day Action Plan pinpointed our insurance gaps immediately. Working with Kutumb brought total financial peace to our multi-generational household.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    5,
    true,
    2
  );

-- ═══════════════════════════════════════════════════════════════════
-- 5. FREQUENTLY ASKED QUESTIONS (FAQS)
-- ═══════════════════════════════════════════════════════════════════
insert into public.faqs (category, question, answer, display_order, is_published)
values
  (
    'Financial Kundali',
    'What is the Financial Kundali?',
    'Financial Kundali is Kutumb Advisory''s proprietary 9-graha diagnostic model that evaluates every area of family wealth — from income stability and emergency coverage to retirement, investments, and legacy planning.',
    1,
    true
  ),
  (
    'Financial Kundali',
    'How long does the assessment take?',
    'The assessment takes approximately 10 to 15 minutes to complete online. You will receive an immediate score breakdown and action plan.',
    2,
    true
  ),
  (
    'Advisory Services',
    'Does Kutumb sell financial products?',
    'No. Kutumb Advisory is an independent fee-only family wealth advisory. We do not accept commissions, ensuring our recommendations are 100% unbiased.',
    3,
    true
  ),
  (
    'Data Security',
    'Is my family data kept secure and private?',
    'Yes. All sensitive PII data is protected with enterprise-grade AES-256 encryption. Your information is strictly confidential and never shared with third parties.',
    4,
    true
  );

-- ═══════════════════════════════════════════════════════════════════
-- 6. INITIAL JOURNAL ARTICLES
-- ═══════════════════════════════════════════════════════════════════
insert into public.articles (title, slug, content, excerpt, category, read_time, author, published, published_at)
values
  (
    'The 9-Graha Architecture of Family Wealth',
    '9-graha-architecture-family-wealth',
    'Wealth management in India has traditionally been transactional — buying an insurance policy here, opening a fixed deposit there. The 9-Graha framework unifies every dimension into a single interconnected structure.',
    'Discover how evaluating your wealth across nine interconnected pillars brings complete clarity to multi-generational family finances.',
    'Wealth Planning',
    '6 min read',
    'Deepika',
    true,
    now()
  ),
  (
    'Why Most Families Suffer from a Visibility Problem',
    'visibility-problem-family-finances',
    'Most Indian families do not suffer from a lack of assets. They suffer from scattered visibility — having multiple accounts, brokers, and advisors without a single source of truth.',
    'How fragmented financial accounts create hidden risks and how to build a unified family balance sheet.',
    'Financial Clarity',
    '4 min read',
    'Rajesh Sharma',
    true,
    now()
  );
