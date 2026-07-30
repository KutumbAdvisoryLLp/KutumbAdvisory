export interface CalculatorDef {
  id: string
  icon: string
  title: string
  description: string
  time: string
  category: string
  group: string
}

export interface CalculatorGroup {
  id: string
  title: string
  subtitle: string
  icon: string
  calculators: CalculatorDef[]
}

export interface ChecklistDef {
  id: string
  icon: string
  title: string
  description: string
  time: string
  items: { id: string; label: string }[]
}

export interface AssessmentDef {
  id: string
  icon: string
  title: string
  description: string
  time: string
  questions: { id: string; text: string; options: { value: string; label: string; score: number }[] }[]
}

const rawCalculators: CalculatorDef[] = [
  { id: 'sip', icon: '📈', title: 'SIP Calculator', description: 'Calculate the future value of your systematic monthly investments.', time: '2 min', category: 'Investment', group: 'build-wealth' },
  { id: 'lumpsum', icon: '💰', title: 'Lumpsum Calculator', description: 'See how a one-time investment grows over time with compound interest.', time: '2 min', category: 'Investment', group: 'build-wealth' },
  { id: 'future-value', icon: '🔮', title: 'Future Value Calculator', description: 'Calculate the future value of any investment or savings.', time: '2 min', category: 'Investment', group: 'build-wealth' },
  { id: 'goal-planner', icon: '🎯', title: 'Goal Planner', description: 'Plan your financial goals with monthly SIP or lumpsum targets.', time: '3 min', category: 'Planning', group: 'build-wealth' },
  { id: 'inflation', icon: '📈', title: 'Inflation Calculator', description: 'Understand how inflation erodes your purchasing power over time.', time: '1 min', category: 'Planning', group: 'build-wealth' },

  { id: 'emergency-fund', icon: '🛡', title: 'Emergency Fund Calculator', description: 'Calculate how much you need for a robust emergency fund.', time: '2 min', category: 'Planning', group: 'protect-wealth' },
  { id: 'hlv', icon: '🧑', title: 'Human Life Value Calculator', description: 'Calculate the economic value of your life for insurance planning.', time: '2 min', category: 'Insurance', group: 'protect-wealth' },
  { id: 'life-insurance', icon: '🛡', title: 'Life Insurance Calculator', description: 'Determine the right life insurance cover for your family.', time: '2 min', category: 'Insurance', group: 'protect-wealth' },
  { id: 'health-insurance', icon: '🏥', title: 'Health Insurance Calculator', description: 'Estimate the health insurance cover your family needs.', time: '2 min', category: 'Insurance', group: 'protect-wealth' },

  { id: 'emi', icon: '🏦', title: 'EMI Calculator', description: 'Calculate your equated monthly installment for any loan.', time: '2 min', category: 'Loan', group: 'borrow-smart' },
  { id: 'home-loan-eligibility', icon: '🏠', title: 'Home Loan Eligibility Calculator', description: 'Check how much home loan you qualify for.', time: '2 min', category: 'Loan', group: 'borrow-smart' },
  { id: 'home-loan-affordability', icon: '🏡', title: 'Home Loan Affordability Calculator', description: 'Find the affordable EMI for your dream home.', time: '2 min', category: 'Loan', group: 'borrow-smart' },
  { id: 'loan-comparison', icon: '⚖', title: 'Loan Comparison Calculator', description: 'Compare multiple loans side by side.', time: '2 min', category: 'Loan', group: 'borrow-smart' },
  { id: 'loan-prepayment', icon: '📉', title: 'Loan Prepayment Calculator', description: 'See how much you save by prepaying your loan.', time: '2 min', category: 'Loan', group: 'borrow-smart' },

  { id: 'retirement-corpus', icon: '🏖', title: 'Retirement Corpus Calculator', description: 'Find out how much you need to retire comfortably.', time: '3 min', category: 'Retirement', group: 'retirement' },
  { id: 'retirement-gap', icon: '📊', title: 'Retirement Gap Calculator', description: 'See if you are on track for retirement and what to adjust.', time: '3 min', category: 'Retirement', group: 'retirement' },
  { id: 'swp', icon: '💸', title: 'SWP Calculator', description: 'Plan your systematic withdrawals during retirement.', time: '2 min', category: 'Retirement', group: 'retirement' },

  { id: 'net-worth', icon: '📋', title: 'Net Worth Calculator', description: 'Calculate your total net worth in seconds.', time: '2 min', category: 'Planning', group: 'family-wealth' },
  { id: 'child-education', icon: '🎓', title: 'Child Education Planner', description: 'Plan for your children\'s higher education expenses.', time: '3 min', category: 'Planning', group: 'family-wealth' },
  { id: 'marriage-planner', icon: '💒', title: 'Marriage Planner', description: 'Estimate the corpus needed for your children\'s marriage.', time: '3 min', category: 'Planning', group: 'family-wealth' },

  { id: 'income-tax', icon: '🧾', title: 'Income Tax Calculator', description: 'Calculate your income tax under old and new regimes.', time: '2 min', category: 'Tax', group: 'tax-portfolio' },
  { id: 'asset-allocation', icon: '📊', title: 'Asset Allocation Calculator', description: 'Visualize and plan your portfolio allocation.', time: '2 min', category: 'Investment', group: 'tax-portfolio' },
  { id: 'portfolio-diversification', icon: '🔄', title: 'Diversification Calculator', description: 'Check how diversified your investment portfolio is.', time: '2 min', category: 'Investment', group: 'tax-portfolio' },
]

export const calculatorGroups: CalculatorGroup[] = [
  {
    id: 'build-wealth',
    title: 'Build Wealth',
    subtitle: 'Growth & Accumulation',
    icon: '📈',
    calculators: rawCalculators.filter(c => c.group === 'build-wealth'),
  },
  {
    id: 'protect-wealth',
    title: 'Protect Wealth',
    subtitle: 'Security & Risk',
    icon: '🛡',
    calculators: rawCalculators.filter(c => c.group === 'protect-wealth'),
  },
  {
    id: 'borrow-smart',
    title: 'Borrow Smart',
    subtitle: 'Loans',
    icon: '🏦',
    calculators: rawCalculators.filter(c => c.group === 'borrow-smart'),
  },
  {
    id: 'retirement',
    title: 'Retirement',
    subtitle: 'Future Planning',
    icon: '🏖',
    calculators: rawCalculators.filter(c => c.group === 'retirement'),
  },
  {
    id: 'family-wealth',
    title: 'Family Wealth',
    subtitle: 'Planning',
    icon: '👨‍👩‍👧‍👦',
    calculators: rawCalculators.filter(c => c.group === 'family-wealth'),
  },
  {
    id: 'tax-portfolio',
    title: 'Tax & Portfolio',
    subtitle: 'Optimization',
    icon: '🧾',
    calculators: rawCalculators.filter(c => c.group === 'tax-portfolio'),
  },
]

export const calculators: CalculatorDef[] = rawCalculators

export const checklists: ChecklistDef[] = [
  {
    id: 'estate-planning',
    icon: '📜',
    title: 'Estate Planning Checklist',
    description: 'Ensure your assets are distributed as per your wishes.',
    time: '10 min',
    items: [
      { id: 'ep1', label: 'Create a registered will' },
      { id: 'ep2', label: 'Nominate beneficiaries for all accounts' },
      { id: 'ep3', label: 'Set up a trust if needed' },
      { id: 'ep4', label: 'Discuss inheritance plans with family' },
      { id: 'ep5', label: 'Review and update will every 3 years' },
      { id: 'ep6', label: 'Document all assets and liabilities' },
      { id: 'ep7', label: 'Appoint power of attorney' },
      { id: 'ep8', label: 'Plan for business succession if applicable' },
    ],
  },
  {
    id: 'financial-documents',
    icon: '📁',
    title: 'Financial Documents Checklist',
    description: 'Organize and secure all your financial documents.',
    time: '15 min',
    items: [
      { id: 'fd1', label: 'PAN Card' },
      { id: 'fd2', label: 'Aadhaar Card' },
      { id: 'fd3', label: 'Bank account statements' },
      { id: 'fd4', label: 'Fixed deposit receipts' },
      { id: 'fd5', label: 'Mutual fund statements' },
      { id: 'fd6', label: 'Stock portfolio statements' },
      { id: 'fd7', label: 'Insurance policy documents' },
      { id: 'fd8', label: 'Property documents' },
      { id: 'fd9', label: 'Loan agreements' },
      { id: 'fd10', label: 'Tax returns (last 3 years)' },
      { id: 'fd11', label: 'Will and trust documents' },
      { id: 'fd12', label: 'Nomination forms' },
    ],
  },
  {
    id: 'insurance-review',
    icon: '🔍',
    title: 'Insurance Review Checklist',
    description: 'Review and optimize your insurance coverage.',
    time: '10 min',
    items: [
      { id: 'ir1', label: 'Review term life insurance coverage' },
      { id: 'ir2', label: 'Check health insurance adequacy' },
      { id: 'ir3', label: 'Review critical illness cover' },
      { id: 'ir4', label: 'Check accidental insurance' },
      { id: 'ir5', label: 'Review premium affordability' },
      { id: 'ir6', label: 'Update nominees on all policies' },
      { id: 'ir7', label: 'Compare with current market options' },
      { id: 'ir8', label: 'Check for policy lapses' },
    ],
  },
  {
    id: 'annual-financial-health',
    icon: '✅',
    title: 'Annual Financial Health Checklist',
    description: 'A yearly review of your complete financial health.',
    time: '20 min',
    items: [
      { id: 'ah1', label: 'Review annual budget vs actual' },
      { id: 'ah2', label: 'Check savings rate achieved' },
      { id: 'ah3', label: 'Review investment performance' },
      { id: 'ah4', label: 'Rebalance portfolio if needed' },
      { id: 'ah5', label: 'Review insurance coverage' },
      { id: 'ah6', label: 'Update will and nominees' },
      { id: 'ah7', label: 'Check credit score' },
      { id: 'ah8', label: 'Review tax planning' },
      { id: 'ah9', label: 'Set financial goals for next year' },
      { id: 'ah10', label: 'Review emergency fund adequacy' },
    ],
  },
  {
    id: 'retirement-readiness',
    icon: '🌅',
    title: 'Retirement Readiness Checklist',
    description: 'Check if you are on track for a dignified retirement.',
    time: '10 min',
    items: [
      { id: 'rr1', label: 'Calculate retirement corpus needed' },
      { id: 'rr2', label: 'Check current retirement savings' },
      { id: 'rr3', label: 'Review NPS/EPF/PPF contributions' },
      { id: 'rr4', label: 'Evaluate pension income sources' },
      { id: 'rr5', label: 'Plan healthcare costs in retirement' },
      { id: 'rr6', label: 'Review asset allocation for retirement' },
      { id: 'rr7', label: 'Plan withdrawal strategy' },
      { id: 'rr8', label: 'Check for income gaps' },
    ],
  },
  {
    id: 'investment-portfolio',
    icon: '💼',
    title: 'Investment Portfolio Checklist',
    description: 'Keep your investment portfolio healthy and aligned.',
    time: '15 min',
    items: [
      { id: 'ip1', label: 'Review asset allocation' },
      { id: 'ip2', label: 'Check diversification across sectors' },
      { id: 'ip3', label: 'Review fund performance vs benchmark' },
      { id: 'ip4', label: 'Rebalance if allocation drifted > 5%' },
      { id: 'ip5', label: 'Check expense ratios' },
      { id: 'ip6', label: 'Review tax efficiency' },
      { id: 'ip7', label: 'Check for overlap in mutual funds' },
      { id: 'ip8', label: 'Review SIP continuations' },
      { id: 'ip9', label: 'Plan new investments' },
    ],
  },
  {
    id: 'family-financial-records',
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Financial Records Checklist',
    description: 'Keep your family financial records organized.',
    time: '15 min',
    items: [
      { id: 'ff1', label: 'Maintain family net worth statement' },
      { id: 'ff2', label: 'Track all income sources' },
      { id: 'ff3', label: 'Track all expenses' },
      { id: 'ff4', label: 'Maintain debt schedule' },
      { id: 'ff5', label: 'Keep investment register' },
      { id: 'ff6', label: 'Maintain insurance schedule' },
      { id: 'ff7', label: 'Keep tax records organized' },
      { id: 'ff8', label: 'Document financial goals' },
      { id: 'ff9', label: 'Store digital copies securely' },
      { id: 'ff10', label: 'Share access with spouse/family' },
    ],
  },
]

export const assessments: AssessmentDef[] = [
  {
    id: 'emergency-fund-readiness',
    icon: '🛡',
    title: 'Emergency Fund Readiness',
    description: 'Assess how prepared you are for financial emergencies.',
    time: '3 min',
    questions: [
      { id: 'ef1', text: 'How many months of expenses can you cover from savings?', options: [
        { value: 'none', label: 'None', score: 0 },
        { value: '1-3', label: '1–3 months', score: 3 },
        { value: '3-6', label: '3–6 months', score: 6 },
        { value: '6-12', label: '6–12 months', score: 8 },
        { value: '12+', label: '12+ months', score: 10 },
      ]},
      { id: 'ef2', text: 'Where is your emergency fund held?', options: [
        { value: 'none', label: 'Not created', score: 0 },
        { value: 'savings', label: 'Savings account', score: 5 },
        { value: 'fd', label: 'Fixed deposit', score: 7 },
        { value: 'liquid', label: 'Liquid fund', score: 8 },
        { value: 'multiple', label: 'Multiple instruments', score: 10 },
      ]},
      { id: 'ef3', text: 'How would you handle a sudden ₹5 lakh expense?', options: [
        { value: 'savings', label: 'From savings comfortably', score: 10 },
        { value: 'investments', label: 'From investments', score: 7 },
        { value: 'credit', label: 'From credit card', score: 4 },
        { value: 'loan', label: 'From loan', score: 2 },
        { value: 'struggle', label: 'Would struggle', score: 0 },
      ]},
    ],
  },
  {
    id: 'insurance-adequacy',
    icon: '🔒',
    title: 'Insurance Adequacy Assessment',
    description: 'Check if your family is adequately protected.',
    time: '3 min',
    questions: [
      { id: 'ia1', text: 'Do you have a life insurance policy?', options: [
        { value: 'adequate', label: 'Yes, adequate cover', score: 10 },
        { value: 'inadequate', label: 'Yes, but inadequate', score: 5 },
        { value: 'not-sure', label: 'Yes, not sure', score: 4 },
        { value: 'planning', label: 'No, planning to', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ]},
      { id: 'ia2', text: 'Do you have health insurance for your family?', options: [
        { value: 'comprehensive', label: 'Yes, comprehensive', score: 10 },
        { value: 'basic', label: 'Yes, basic', score: 6 },
        { value: 'self', label: 'Only self', score: 4 },
        { value: 'employer', label: 'Only through employer', score: 3 },
        { value: 'no', label: 'No', score: 0 },
      ]},
      { id: 'ia3', text: 'Do you have critical illness or accident cover?', options: [
        { value: 'both', label: 'Both', score: 10 },
        { value: 'critical', label: 'Critical illness only', score: 7 },
        { value: 'accident', label: 'Accident cover only', score: 6 },
        { value: 'neither', label: 'Neither', score: 0 },
        { value: 'not-sure', label: 'Not sure', score: 2 },
      ]},
    ],
  },
  {
    id: 'retirement-readiness',
    icon: '🌅',
    title: 'Retirement Readiness Score',
    description: 'See how prepared you are for retirement.',
    time: '3 min',
    questions: [
      { id: 'rr1', text: 'Have you calculated your retirement corpus?', options: [
        { value: 'detailed', label: 'Yes, in detail', score: 10 },
        { value: 'rough', label: 'Yes, roughly', score: 7 },
        { value: 'started', label: 'Started planning', score: 4 },
        { value: 'planning', label: 'Planning to soon', score: 2 },
        { value: 'no', label: 'Never thought about it', score: 0 },
      ]},
      { id: 'rr2', text: 'Are you consistently investing for retirement?', options: [
        { value: 'tracking', label: 'Yes, tracking targets', score: 10 },
        { value: 'inconsistent', label: 'Yes, but inconsistently', score: 6 },
        { value: 'recent', label: 'Started recently', score: 4 },
        { value: 'planning', label: 'Planning to start', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ]},
      { id: 'rr3', text: 'What is your retirement savings vehicle?', options: [
        { value: 'multiple', label: 'Multiple (NPS, EPF, PPF, MF)', score: 10 },
        { value: 'nps-epf', label: 'NPS & EPF only', score: 7 },
        { value: 'epf-only', label: 'EPF only', score: 4 },
        { value: 'not-sure', label: 'Not sure', score: 2 },
        { value: 'none', label: 'None', score: 0 },
      ]},
    ],
  },
  {
    id: 'investment-risk',
    icon: '📊',
    title: 'Investment Risk Assessment',
    description: 'Understand your risk profile and investment style.',
    time: '3 min',
    questions: [
      { id: 'ir1', text: 'What is your investment horizon?', options: [
        { value: 'long', label: '10+ years', score: 10 },
        { value: 'medium-long', label: '5–10 years', score: 7 },
        { value: 'medium', label: '3–5 years', score: 5 },
        { value: 'short-medium', label: '1–3 years', score: 3 },
        { value: 'short', label: 'Less than 1 year', score: 1 },
      ]},
      { id: 'ir2', text: 'How do you react to a 20% market drop?', options: [
        { value: 'buy', label: 'Buy more — great opportunity', score: 10 },
        { value: 'hold', label: 'Hold and wait', score: 7 },
        { value: 'nervous', label: 'Get nervous but hold', score: 4 },
        { value: 'reduce', label: 'Reduce exposure', score: 2 },
        { value: 'exit', label: 'Exit completely', score: 0 },
      ]},
      { id: 'ir3', text: 'What is your primary investment objective?', options: [
        { value: 'growth', label: 'Maximum growth', score: 10 },
        { value: 'balanced', label: 'Growth with some safety', score: 7 },
        { value: 'income', label: 'Regular income', score: 4 },
        { value: 'preservation', label: 'Capital preservation', score: 2 },
        { value: 'not-sure', label: 'Not sure', score: 1 },
      ]},
    ],
  },
  {
    id: 'debt-health',
    icon: '💳',
    title: 'Debt Health Assessment',
    description: 'Evaluate the health of your debt portfolio.',
    time: '2 min',
    questions: [
      { id: 'dh1', text: 'What is your debt-to-income ratio?', options: [
        { value: 'under-10', label: 'Under 10%', score: 10 },
        { value: '10-20', label: '10–20%', score: 8 },
        { value: '20-30', label: '20–30%', score: 5 },
        { value: '30-40', label: '30–40%', score: 3 },
        { value: 'over-40', label: 'Over 40%', score: 0 },
      ]},
      { id: 'dh2', text: 'Do you pay credit card bills in full?', options: [
        { value: 'always', label: 'Always', score: 10 },
        { value: 'mostly', label: 'Most months', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'minimum', label: 'Minimum payment', score: 2 },
        { value: 'no-card', label: 'No credit card', score: 5 },
      ]},
      { id: 'dh3', text: 'How many EMIs are you currently paying?', options: [
        { value: 'none', label: 'None', score: 10 },
        { value: 'one', label: '1 EMI', score: 7 },
        { value: 'two', label: '2 EMIs', score: 4 },
        { value: 'three', label: '3 EMIs', score: 2 },
        { value: 'four-plus', label: '4+ EMIs', score: 0 },
      ]},
    ],
  },
  {
    id: 'goal-readiness',
    icon: '🎯',
    title: 'Financial Goal Readiness',
    description: 'Assess how ready you are to achieve your goals.',
    time: '2 min',
    questions: [
      { id: 'gr1', text: 'Do you have specific financial goals?', options: [
        { value: 'detailed', label: 'Yes, detailed with amounts', score: 10 },
        { value: 'general', label: 'Yes, general ideas', score: 6 },
        { value: 'some', label: 'Somewhat', score: 4 },
        { value: 'vague', label: 'Vague plans', score: 2 },
        { value: 'none', label: 'No goals defined', score: 0 },
      ]},
      { id: 'gr2', text: 'Do you have a plan to achieve your goals?', options: [
        { value: 'detailed', label: 'Yes, detailed investment plan', score: 10 },
        { value: 'rough', label: 'Yes, rough plan', score: 6 },
        { value: 'started', label: 'Started working on it', score: 4 },
        { value: 'planning', label: 'Planning to create one', score: 2 },
        { value: 'no', label: 'No plan', score: 0 },
      ]},
      { id: 'gr3', text: 'Do you track progress toward your goals?', options: [
        { value: 'quarterly', label: 'Yes, quarterly review', score: 10 },
        { value: 'yearly', label: 'Yes, yearly review', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'rarely', label: 'Rarely', score: 2 },
        { value: 'no', label: 'No tracking', score: 0 },
      ]},
    ],
  },
  {
    id: 'legacy-planning',
    icon: '📜',
    title: 'Legacy Planning Readiness',
    description: 'Check if your legacy and succession plans are in place.',
    time: '2 min',
    questions: [
      { id: 'lp1', text: 'Have you created a will?', options: [
        { value: 'registered', label: 'Yes, registered', score: 10 },
        { value: 'not-registered', label: 'Yes, not registered', score: 6 },
        { value: 'process', label: 'In process', score: 4 },
        { value: 'planning', label: 'Planning to', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ]},
      { id: 'lp2', text: 'Are your assets properly nominated?', options: [
        { value: 'all', label: 'All of them', score: 10 },
        { value: 'most', label: 'Most of them', score: 7 },
        { value: 'some', label: 'Some of them', score: 4 },
        { value: 'not-sure', label: 'Not sure', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ]},
      { id: 'lp3', text: 'Have you discussed inheritance with your family?', options: [
        { value: 'detailed', label: 'Yes, in detail', score: 10 },
        { value: 'brief', label: 'Yes, briefly', score: 6 },
        { value: 'planned', label: 'Planning to discuss', score: 4 },
        { value: 'hesitant', label: 'Hesitant to discuss', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ]},
    ],
  },
  {
    id: 'budget-health',
    icon: '📋',
    title: 'Budget Health Score',
    description: 'Evaluate your budgeting and spending habits.',
    time: '2 min',
    questions: [
      { id: 'bh1', text: 'Do you maintain a monthly budget?', options: [
        { value: 'always', label: 'Always', score: 10 },
        { value: 'mostly', label: 'Most months', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'rare', label: 'Rarely', score: 2 },
        { value: 'never', label: 'Never', score: 0 },
      ]},
      { id: 'bh2', text: 'What percentage of income do you save?', options: [
        { value: '30-plus', label: '30%+', score: 10 },
        { value: '20-30', label: '20–30%', score: 8 },
        { value: '10-20', label: '10–20%', score: 5 },
        { value: '0-10', label: '0–10%', score: 2 },
        { value: 'nothing', label: 'Nothing', score: 0 },
      ]},
      { id: 'bh3', text: 'How do you track your expenses?', options: [
        { value: 'app', label: 'App or software', score: 10 },
        { value: 'spreadsheet', label: 'Spreadsheet', score: 7 },
        { value: 'mental', label: 'Mental tracking', score: 4 },
        { value: 'statements', label: 'Bank statements review', score: 3 },
        { value: 'none', label: 'Don\'t track', score: 0 },
      ]},
    ],
  },
]
