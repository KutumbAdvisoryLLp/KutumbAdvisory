'use client'

const resources = [
  { category: 'Income', items: ['7 Ways to Diversify Your Income', 'The Power of Passive Income', 'How to Negotiate Your Salary'] },
  { category: 'Protection', items: ['Understanding Term Insurance', 'Health Insurance Guide for Families', 'Critical Illness Cover Explained'] },
  { category: 'Investing', items: ['SIP vs Lumpsum: Which is Better?', 'Introduction to Mutual Funds', 'Building a Diversified Portfolio'] },
  { category: 'Retirement', items: ['Retirement Planning in Your 30s', 'NPS vs PPF vs EPF', 'Calculating Your Retirement Corpus'] },
  { category: 'Estate', items: ['Why Every Indian Needs a Will', 'Trust vs Will: What\'s the Difference?', 'Succession Planning Guide'] },
]

export default function ResourcesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Resources</h1>
      <p className="text-slate mt-1">Curated articles to improve your financial knowledge.</p>

      <div className="mt-8 space-y-8 mb-10">
        {resources.map((section) => (
          <div key={section.category}>
            <h2 className="font-serif text-2xl text-navy mb-4">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item}
                  className="p-4 bg-white rounded-xl border border-slate-lighter/20 shadow-card flex items-center gap-3 hover:shadow-card-hover transition-shadow cursor-default"
                >
                  <span className="text-slate-light">📄</span>
                  <span className="text-sm text-charcoal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
