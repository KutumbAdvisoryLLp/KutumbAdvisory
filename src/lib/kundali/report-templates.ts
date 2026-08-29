export const PAGE_2_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Kutumb Advisory Kundali — Cover</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #eeeeee; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; height: 297mm; background: #ffffff; position: relative; overflow: hidden; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .cover-header { position: absolute; top: 28mm; left: 0; width: 100%; text-align: center; }
        .cover-header h1 { font-size: 23px; font-weight: 700; letter-spacing: 0.6px; color: #1a1a2e; text-transform: uppercase; }
        .cover-header h2 { margin-top: 11mm; font-size: 17px; font-weight: 400; color: #1a1a2e; }
        .cover-header p { margin-top: 6mm; font-size: 12.5px; font-weight: 400; color: #1a1a2e; }
        .brand-emblem { position: absolute; top: 72mm; left: 0; width: 100%; text-align: center; }
        .brand-emblem img { width: 95mm; height: auto; max-height: 95mm; object-fit: contain; }
        .client-information { position: absolute; top: 190mm; left: 8%; width: 84%; }
        .client-information .field { display: flex; align-items: center; margin-bottom: 7mm; padding: 4px 0; }
        .client-information .label { font-size: 15px; font-weight: 600; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.5px; min-width: 180px; }
        .client-information .field-val { font-size: 16px; font-weight: 700; color: #172A4A; padding-left: 12px; }
        footer { position: absolute; bottom: 4%; left: 5%; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: #111111; }
        .emblem { position: absolute; bottom: 3%; left: 50%; transform: translateX(-50%); width: 24px; height: 22px; }
        .emblem svg { width: 100%; height: 100%; }
        .emblem text { font-size: 7px; font-weight: 600; fill: #333333; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <main class="page">
        <header class="cover-header">
            <h1>Kutumb Advisory Kundali™</h1>
            <h2>Family Financial Wealth Assessment</h2>
            <p>The Financial Blueprint for Multi-Generational Wealth Creation</p>
        </header>
        <section class="brand-emblem">
            <img src="/report/pagelogo_transparent.png" alt="Kutumb Advisory LLP emblem">
        </section>
        <section class="client-information">
            <div class="field">
                <span class="label">CLIENT NAME:</span>
                <span class="field-val client-name-val"></span>
            </div>
            <div class="field">
                <span class="label">ASSESSMENT DATE:</span>
                <span class="field-val assessment-date-val"></span>
            </div>
            <div class="field">
                <span class="label">ADVISOR NAME:</span>
                <span class="field-val advisor-name-val">Kutumb Wealth Advisor</span>
            </div>
        </section>
        <footer>Kutumb Advisory LLP</footer>
        <div class="emblem">
            <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#333333" stroke-width="0.8">
                    <rect x="9" y="6" width="28" height="28" transform="rotate(45 23 20)" />
                    <rect x="13" y="10" width="20" height="20" />
                </g>
                <text x="23" y="23" text-anchor="middle" font-size="7">2</text>
            </svg>
        </div>
    </main>
</body>
</html>`

export const PAGE_3_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>About the Kutumb Advisory Kundali Booklet</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #f4f4f2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; height: 297mm; background: #ffffff; position: relative; overflow: hidden; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .header { position: absolute; top: 5.5%; left: 9%; padding-left: 6%; border-left: 2.5px solid #D7A52E; }
        .header h1 { font-size: 17pt; font-weight: 700; color: #172A4A; line-height: 1.3; }
        .header .subtitle { margin-top: 8px; font-size: 10.5pt; font-weight: 400; color: #111111; }
        .intro { position: absolute; top: 17%; left: 9%; width: 82%; }
        .intro p { font-size: 10.5pt; font-weight: 400; line-height: 1.45; color: #111111; }
        .graha-grid { position: absolute; top: 23%; left: 9%; width: 82%; height: 45%; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); column-gap: 18mm; row-gap: 6mm; }
        .graha-card { border-radius: 4px; padding: 24px 20px; display: flex; flex-direction: column; justify-content: flex-start; }
        .graha-card .name { font-size: 13pt; font-weight: 700; color: #111111; margin-bottom: 12px; }
        .graha-card .meaning { font-size: 10pt; font-weight: 400; line-height: 1.35; color: #333333; }
        .c-surya { background: #FFF9E9; } .c-chandra { background: #F4F1FC; } .c-mangal { background: #FFF4EC; } .c-budh { background: #F4F8EC; } .c-guru { background: #EEF7FC; } .c-shukra { background: #FFF0F4; } .c-shani { background: #F5F0FA; } .c-rahu { background: #FFF5EA; } .c-ketu { background: #F5F4F1; }
        .scoring-heading { position: absolute; top: 73.5%; left: 0; width: 100%; text-align: center; font-size: 12.5pt; font-weight: 700; color: #172A4A; }
        .scoring { position: absolute; top: 77.5%; left: 9%; width: 82%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6mm; }
        .score-box { border-radius: 6px; padding: 14px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; min-height: 52px; }
        .score-box .num { font-size: 16pt; font-weight: 700; color: #111111; line-height: 1; }
        .score-box .label { font-size: 9pt; font-weight: 600; color: #333333; }
        .s-strong { background: #EEF7E9; } .s-mild { background: #FFF8E8; } .s-moderate { background: #FFF1E8; } .s-severe { background: #FFF0F3; }
        footer { position: absolute; bottom: 3.5%; left: 8%; font-size: 9.5pt; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: #111111; }
        .emblem { position: absolute; bottom: 3%; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; }
        .emblem svg { width: 100%; height: 100%; }
        .emblem text { font-size: 7px; font-weight: 600; fill: #333333; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <main class="page">
        <header class="header">
            <h1>About the Kutumb Advisory Kundali Booklet</h1>
            <div class="subtitle">Understanding the nine-graha framework</div>
        </header>
        <section class="intro">
            <p>Maps nine financial forces that determine a family's wealth health. Each graha represents a pillar — and a weakness in any one creates a financial dosha.</p>
        </section>
        <section class="graha-grid">
            <div class="graha-card c-surya"><div class="name">Surya</div><div class="meaning">Income &amp; Earning Power</div></div>
            <div class="graha-card c-chandra"><div class="name">Chandra</div><div class="meaning">Emergency &amp; Financial Peace</div></div>
            <div class="graha-card c-mangal"><div class="name">Mangal</div><div class="meaning">Protection &amp; Insurance</div></div>
            <div class="graha-card c-budh"><div class="name">Budh</div><div class="meaning">Financial Discipline</div></div>
            <div class="graha-card c-guru"><div class="name">Guru</div><div class="meaning">Wealth Creation</div></div>
            <div class="graha-card c-shukra"><div class="name">Shukra</div><div class="meaning">Lifestyle &amp; Happiness</div></div>
            <div class="graha-card c-shani"><div class="name">Shani</div><div class="meaning">Retirement &amp; Dignity</div></div>
            <div class="graha-card c-rahu"><div class="name">Rahu</div><div class="meaning">Financial Risk</div></div>
            <div class="graha-card c-ketu"><div class="name">Ketu</div><div class="meaning">Legacy &amp; Succession</div></div>
        </section>
        <div class="scoring-heading">Scoring Guide</div>
        <section class="scoring">
            <div class="score-box s-strong"><span class="num">9–10</span><span class="label">Strong</span></div>
            <div class="score-box s-mild"><span class="num">7–8</span><span class="label">Mild Dosha</span></div>
            <div class="score-box s-moderate"><span class="num">4–6</span><span class="label">Moderate</span></div>
            <div class="score-box s-severe"><span class="num">0–3</span><span class="label">Severe Dosha</span></div>
        </section>
        <footer>Kutumb Advisory LLP</footer>
        <div class="emblem">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#333333" stroke-width="0.8">
                    <rect x="6" y="6" width="28" height="28" transform="rotate(45 20 20)" />
                    <rect x="10" y="10" width="20" height="20" />
                </g>
                <text x="20" y="23" text-anchor="middle">3</text>
            </svg>
        </div>
    </main>
</body>
</html>`

export const PAGE_4_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Section 01 — Family Profile</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #f4f4f2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; height: 297mm; background: #ffffff; position: relative; overflow: hidden; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .spine { position: absolute; top: 5.5%; left: 9%; width: 82%; background: #D7A52E; border-radius: 3px 14px 14px 3px; padding: 12px 22px; color: #ffffff; }
        .spine .spine-title { font-size: 14.5pt; font-weight: 700; }
        .spine .spine-sub { margin-top: 3px; font-size: 9pt; font-weight: 400; opacity: 0.92; }
        .profile-fields { position: absolute; top: 14.5%; left: 9%; width: 82%; display: grid; grid-template-columns: 1fr 1fr; column-gap: 14mm; }
        .field-col .field-row { display: flex; justify-content: space-between; align-items: center; min-height: 32px; padding: 5px 0; border-bottom: 0.6px solid #e0e0e0; font-size: 9.5pt; }
        .field-col .field-row .flabel { font-weight: 500; color: #444444; line-height: 1.4; }
        .field-col .field-row .fval { font-weight: 600; color: #172A4A; text-align: right; line-height: 1.4; }
        .networth-heading { position: absolute; top: 50.5%; left: 9%; font-size: 12.5pt; font-weight: 700; color: #172A4A; }
        .networth-grid { position: absolute; top: 54.5%; left: 9%; width: 82%; display: grid; grid-template-columns: 1fr 1fr; column-gap: 10mm; }
        .nw-box { background: #F7F6F3; border-radius: 4px; padding: 12px 16px; }
        .nw-row { display: flex; justify-content: space-between; align-items: center; min-height: 28px; padding: 5px 0; border-bottom: 0.6px solid #e2e0da; font-size: 9pt; }
        .nw-row:last-child { border-bottom: none; }
        .nw-row .nlabel { font-weight: 400; color: #333333; line-height: 1.4; }
        .nw-row .nval { font-weight: 600; color: #172A4A; line-height: 1.4; }
        .nw-row.nw-total-row { margin-top: 4px; padding-top: 8px; border-top: 1.5px solid #172A4A; border-bottom: none; }
        .networth-total { position: absolute; top: 85%; left: 9%; width: 82%; background: #172A4A; color: #ffffff; border-radius: 6px; padding: 16px 22px; display: flex; justify-content: space-between; align-items: center; font-size: 11pt; font-weight: 700; line-height: 1; }
        .networth-total span { line-height: 1; display: inline-flex; align-items: center; }
        .networth-total .networth-val { font-size: 13pt; font-weight: 700; color: #D7A52E; line-height: 1; }
        footer { position: absolute; bottom: 3.5%; left: 8%; font-size: 9.5pt; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: #111111; }
        .emblem { position: absolute; bottom: 3%; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; }
        .emblem svg { width: 100%; height: 100%; }
        .emblem text { font-size: 7px; font-weight: 600; fill: #333333; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <main class="page">
        <div class="spine">
            <div class="spine-title">Section 01 — Family Profile</div>
            <div class="spine-sub">Family and financial snapshot</div>
        </div>
        <section class="profile-fields">
            <div class="field-col">
                <div class="field-row"><span class="flabel">Family Name</span><span class="fval family-name-val">—</span></div>
                <div class="field-row"><span class="flabel">Primary Earning Member</span><span class="fval primary-member-val">—</span></div>
                <div class="field-row"><span class="flabel">Age</span><span class="fval age-val">—</span></div>
                <div class="field-row"><span class="flabel">Spouse Name</span><span class="fval spouse-val">—</span></div>
                <div class="field-row"><span class="flabel">Children</span><span class="fval children-val">—</span></div>
                <div class="field-row"><span class="flabel">Occupation</span><span class="fval occupation-val">—</span></div>
                <div class="field-row"><span class="flabel">Risk Profile</span><span class="fval risk-profile-val">—</span></div>
            </div>
            <div class="field-col">
                <div class="field-row"><span class="flabel">Financial Goal 1</span><span class="fval goal1-val">—</span></div>
                <div class="field-row"><span class="flabel">Financial Goal 2</span><span class="fval goal2-val">—</span></div>
                <div class="field-row"><span class="flabel">Financial Goal 3</span><span class="fval goal3-val">—</span></div>
                <div class="field-row"><span class="flabel">Monthly Expenses</span><span class="fval monthly-expenses-val">—</span></div>
                <div class="field-row"><span class="flabel">Existing Insurance</span><span class="fval insurance-val">—</span></div>
            </div>
        </section>
        <div class="networth-heading">Net Worth Worksheet</div>
        <section class="networth-grid">
            <div class="nw-box">
                <div class="nw-row"><span class="nlabel">Bank &amp; FD</span><span class="nval bank-fd-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Mutual Funds</span><span class="nval mutual-funds-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Shares</span><span class="nval shares-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Property</span><span class="nval property-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Gold</span><span class="nval gold-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">EPF / PPF / NPS</span><span class="nval epf-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Insurance Value</span><span class="nval insurance-value-val">₹0</span></div>
                <div class="nw-row nw-total-row"><span class="nlabel" style="font-weight:700; color:#172A4A;">Total Assets</span><span class="ntotal-assets-val" style="font-weight:700; color:#172A4A;">₹0</span></div>
            </div>
            <div class="nw-box">
                <div class="nw-row"><span class="nlabel">Home Loan</span><span class="nval home-loan-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Personal Loan</span><span class="nval personal-loan-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Vehicle Loan</span><span class="nval vehicle-loan-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Credit Card</span><span class="nval credit-card-val">₹0</span></div>
                <div class="nw-row"><span class="nlabel">Other Loans</span><span class="nval other-loans-val">₹0</span></div>
                <div class="nw-row nw-total-row"><span class="nlabel" style="font-weight:700; color:#172A4A;">Total Liabilities</span><span class="ntotal-liabilities-val" style="font-weight:700; color:#172A4A;">₹0</span></div>
            </div>
        </section>
        <div class="networth-total">
            <span>Net Worth (Assets − Liabilities)</span>
            <span class="networth-val">₹0</span>
        </div>
        <footer>Kutumb Advisory LLP</footer>
        <div class="emblem">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#333333" stroke-width="0.8">
                    <rect x="6" y="6" width="28" height="28" transform="rotate(45 20 20)" />
                    <rect x="10" y="10" width="20" height="20" />
                </g>
                <text x="20" y="23" text-anchor="middle">4</text>
            </svg>
        </div>
    </main>
</body>
</html>`

function makeGrahaTemplate(title: string, sub: string, color: string, pageNum: number, questions: string[]) {
    const rowHeightMm = Math.min(25, Math.floor(155 / questions.length))
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #eeeeee; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; height: 297mm; background: #ffffff; position: relative; overflow: hidden; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .section-header { position: absolute; top: 5.5%; left: 5%; width: 90%; height: 30mm; background: ${color}; border-radius: 4px 16px 16px 4px; padding: 18px 24px; color: #ffffff; display: flex; flex-direction: column; justify-content: center; }
        .section-header h1 { font-size: 18px; font-weight: 700; color: #ffffff; }
        .section-header p { margin-top: 6px; font-size: 12.5px; font-weight: 400; color: #ffffff; opacity: 0.92; line-height: 1.35; }
        .questionnaire { position: absolute; top: 17.5%; left: 5%; width: 90%; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #dedede; }
        thead th { background: #fbfbfa; font-size: 13px; font-weight: 700; color: #172A4A; padding: 10px 14px; border-bottom: 1px solid #dedede; border-right: 1px solid #dddddd; }
        thead th:last-child { border-right: none; }
        th.col-question, td.col-question { width: 46%; text-align: left; }
        th.col-yesno, td.col-yesno { width: 14%; text-align: center; }
        th.col-remarks, td.col-remarks { width: 40%; text-align: left; }
        tbody td { border-bottom: 1px solid #e6e6e6; border-right: 1px solid #dddddd; height: ${rowHeightMm}mm; vertical-align: middle; padding: 10px 14px; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.45; }
        tbody tr:last-child td { border-bottom: 1px solid #dedede; }
        tbody td:last-child { border-right: none; }
        td.col-question { font-size: 12.5px; font-weight: 500; color: #111111; }
        td.col-yesno { font-size: 13px; font-weight: 700; }
        td.col-remarks { font-size: 11.5px; color: #333333; }
        .assessment-footer { position: absolute; top: 76.5%; left: 5%; width: 90%; }
        .score-dosha-row { display: flex; justify-content: space-around; align-items: center; background: #F7F8FA; padding: 12px 20px; border-radius: 6px; border: 1px solid #E2E8F0; }
        .score { font-size: 13.5px; font-weight: 600; color: #172A4A; text-align: center; }
        .score-val { font-size: 15px; font-weight: 700; color: #172A4A; margin-left: 6px; }
        .dosha { font-size: 13.5px; font-weight: 600; color: #172A4A; text-align: center; }
        .observation { margin-top: 14px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; }
        .obs-title { font-size: 11.5px; font-weight: 700; color: #172A4A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .observation-text { font-size: 11.5px; color: #333333; line-height: 1.45; }
        footer { position: absolute; bottom: 3.5%; left: 5%; right: 5%; display: flex; justify-content: space-between; align-items: center; }
        footer .brand { font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: #111111; }
        .emblem { position: absolute; bottom: 3%; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; }
        .emblem svg { width: 100%; height: 100%; }
        .emblem text { font-size: 7px; font-weight: 600; fill: #333333; font-family: Arial, sans-serif; }
        @media print { html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; } body { background: #ffffff; } .page { width: 210mm; height: 297mm; margin: 0; box-shadow: none; } }
    </style>
</head>
<body>
    <main class="page">
        <header class="section-header">
            <h1>${title}</h1>
            <p>${sub}</p>
        </header>
        <section class="questionnaire">
            <table>
                <thead>
                    <tr>
                        <th class="col-question">Question</th>
                        <th class="col-yesno">Yes / No</th>
                        <th class="col-remarks">Advisor Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${questions.map(q => `<tr><td class="col-question">${q}</td><td class="col-yesno"></td><td class="col-remarks"></td></tr>`).join("")}
                </tbody>
            </table>
        </section>
        <section class="assessment-footer">
            <div class="score-dosha-row">
                <div class="score">Score (0-10): <span class="score-val"></span></div>
                <div class="dosha">Dosha: <span class="dosha-val">None</span></div>
            </div>
            <div class="observation">
                <div class="obs-title">Advisor Observation</div>
                <div class="observation-text"></div>
            </div>
        </section>
        <footer>
            <span class="brand">Kutumb Advisory LLP</span>
        </footer>
        <div class="emblem">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#333333" stroke-width="0.8">
                    <rect x="6" y="6" width="28" height="28" transform="rotate(45 20 20)" />
                    <rect x="10" y="10" width="20" height="20" />
                </g>
                <text x="20" y="23" text-anchor="middle">${pageNum}</text>
            </svg>
        </div>
    </main>
</body>
</html>`
}

export const PAGE_5_TEMPLATE = makeGrahaTemplate(
    "Surya — Income &amp; Earning Power",
    "The energy that fuels the family's financial engine",
    "#B87508",
    5,
    [
        "More than one source of income?",
        "Income increased consistently over last 3 years?",
        "Plan exists if income stops suddenly?",
        "Income dependent on a single source only?",
        "Invested in skill development recently?"
    ]
)

export const PAGE_6_TEMPLATE = makeGrahaTemplate(
    "Chandra — Emergency &amp; Financial Peace",
    "The calm reserve that protects the family in crisis",
    "#0877B9",
    6,
    [
        "Emergency fund in place?",
        "Family can survive 6 months without income?",
        "Family can survive 12 months without income?",
        "Always maintain liquid savings?",
        "Loans taken during past emergencies?"
    ]
)

export const PAGE_7_TEMPLATE = makeGrahaTemplate(
    "Mangal — Protection &amp; Insurance",
    "The shield that defends the family against unforeseen financial loss",
    "#B43D2F",
    7,
    [
        "Life insurance cover equal to 10–15x income?",
        "Comprehensive health insurance in place?",
        "Personal accident / disability cover taken?",
        "Critical illness cover active?",
        "Annual insurance cover review conducted?"
    ]
)

export const PAGE_8_TEMPLATE = makeGrahaTemplate(
    "Budh — Financial Discipline",
    "The intellect that governs cash flow, budget, and debt management",
    "#4A7C29",
    8,
    [
        "Monthly budget followed consistently?",
        "Expenses tracked regularly?",
        "High-cost debt kept under control?",
        "Automated savings on payday?",
        "48-hour cooling period for major spends?"
    ]
)

export const PAGE_9_TEMPLATE = makeGrahaTemplate(
    "Guru — Wealth Creation",
    "The wisdom that compounds assets over long horizons",
    "#007B88",
    9,
    [
        "Goal-linked investment strategy in place?",
        "Monthly SIPs active in equity?",
        "Portfolio diversified across asset classes?",
        "Investments beating long-term inflation?",
        "Written 10-year wealth plan exists?"
    ]
)

export const PAGE_10_TEMPLATE = makeGrahaTemplate(
    "Shukra — Lifestyle &amp; Happiness",
    "The harmony between financial security and enjoying life",
    "#C2185B",
    10,
    [
        "Financial peace allows stress-free living?",
        "Annual vacation fund maintained?",
        "Controlled lifestyle inflation?",
        "Avoiding status-driven spending?",
        "Dedicated budget for family experiences?"
    ]
)

export const PAGE_11_TEMPLATE = makeGrahaTemplate(
    "Shani — Retirement &amp; Dignity",
    "The patience that secures independence in golden years",
    "#512DA8",
    11,
    [
        "Target retirement corpus calculated?",
        "Dedicated monthly retirement investments?",
        "Retirement gap assessed and tracked?",
        "Projected retirement income sufficient?",
        "Senior citizen healthcare corpus planned?"
    ]
)

export const PAGE_12_TEMPLATE = makeGrahaTemplate(
    "Rahu — Financial Risk",
    "The vigilance that wards off financial traps and speculation",
    "#D84315",
    12,
    [
        "Avoid get-rich-quick schemes?",
        "Understand every investment made?",
        "Avoid emotional financial decisions?",
        "Seek professional guidance regularly?",
        "Portfolio aligned to actual risk profile?",
        "Do you know about inflation?",
        "Do you know about market-risk?"
    ]
)

export const PAGE_13_TEMPLATE = makeGrahaTemplate(
    "Ketu — Legacy &amp; Succession",
    "The clarity that passes wealth smoothly to future generations",
    "#4E342E",
    13,
    [
        "Registered Will drafted and updated?",
        "Nominations updated on all bank &amp; investment accounts?",
        "Family aware of asset &amp; document details?",
        "Succession plan clear for business/personal assets?",
        "Financial succession discussed with family?"
    ]
)

export const PAGE_14_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Financial Kundali Scorecard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #eeeeee; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; height: 297mm; background: #ffffff; position: relative; overflow: hidden; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .section-header { position: absolute; top: 4%; left: 5%; width: 90%; height: 26mm; background: #3B414B; border-radius: 4px 16px 16px 4px; padding: 16px 24px; color: #ffffff; display: flex; flex-direction: column; justify-content: center; }
        .section-header h1 { font-size: 18px; font-weight: 700; color: #ffffff; }
        .section-header p { margin-top: 6px; font-size: 12.5px; font-weight: 400; color: #ffffff; opacity: 0.9; }
        .score-grid { position: absolute; top: 15%; left: 5%; width: 90%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .score-card { border: 1px solid #e2e2e2; border-radius: 4px; padding: 8px 12px; min-height: 15mm; display: flex; flex-direction: column; justify-content: space-between; }
        .score-card .g-name { font-size: 12.5px; font-weight: 700; color: #111111; }
        .score-card .g-score { margin-top: 4px; font-size: 17px; font-weight: 700; color: #172A4A; }
        .score-card .g-dosha { margin-top: 2px; font-size: 11px; font-weight: 600; }
        .c-surya { background: #FFF9E9; } .c-chandra { background: #EEF3FB; } .c-mangal { background: #FBECEC; } .c-budh { background: #F3F8EC; } .c-guru { background: #EAF6F1; } .c-shukra { background: #FBEDF1; } .c-shani { background: #F1EEF7; } .c-rahu { background: #FBF0E5; } .c-ketu { background: #F1F0EE; }
        .total-bar { position: absolute; top: 36%; left: 5%; width: 90%; background: #172A4A; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; color: #ffffff; line-height: 1; }
        .total-bar span { line-height: 1; display: inline-flex; align-items: center; }
        .total-bar .total-label { font-size: 14px; font-weight: 700; }
        .total-bar .total-score { font-size: 16px; font-weight: 700; color: #D7A52E; }
        .wheel-heading { position: absolute; top: 41.5%; left: 5%; font-size: 12.5pt; font-weight: 700; color: #172A4A; }
        .radar-wrap { position: absolute; top: 43.5%; left: 50%; transform: translateX(-50%); width: 82mm; }
        .radar-wrap svg { width: 100%; height: auto; overflow: visible; }
        .radar-label { font-size: 11px; font-weight: 700; fill: #111111; font-family: "Inter", sans-serif; }
        .remedy-table { position: absolute; top: 73.5%; left: 5%; width: 90%; }
        .remedy-table-heading { font-size: 13px; font-weight: 700; color: #172A4A; margin-bottom: 12px; }
        .remedy-table table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #dddddd; margin-top: 0; }
        .remedy-table th { background: #f7f6f4; font-size: 11.5px; font-weight: 700; color: #172A4A; text-align: left; padding: 8px 12px; border-bottom: 1px solid #dddddd; border-right: 1px solid #dddddd; }
        .remedy-table td { font-size: 11px; padding: 8px 12px; border-bottom: 1px solid #e6e6e6; border-right: 1px solid #dddddd; vertical-align: middle; line-height: 1.45; }
        .remedy-table th:last-child, .remedy-table td:last-child { border-right: none; }
        .col-num { width: 8%; text-align: center; }
        footer { position: absolute; bottom: 3.5%; left: 5%; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: #111111; }
        .emblem { position: absolute; bottom: 3%; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; }
        .emblem svg { width: 100%; height: 100%; }
        .emblem text { font-size: 7px; font-weight: 600; fill: #333333; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <main class="page">
        <header class="section-header">
            <h1>Financial Kundali Scorecard</h1>
            <p>9-Graha Financial Diagnostic Overview</p>
        </header>
        <section class="score-grid">
            <div class="score-card c-surya"><div class="g-name">Surya (Income)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-chandra"><div class="g-name">Chandra (Emergency)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-mangal"><div class="g-name">Mangal (Protection)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-budh"><div class="g-name">Budh (Discipline)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-guru"><div class="g-name">Guru (Wealth)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-shukra"><div class="g-name">Shukra (Lifestyle)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-shani"><div class="g-name">Shani (Retirement)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-rahu"><div class="g-name">Rahu (Risk)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
            <div class="score-card c-ketu"><div class="g-name">Ketu (Legacy)</div><div class="g-score"><span class="dash"></span>/ 10</div><div class="g-dosha">None</div></div>
        </section>
        <div class="total-bar">
            <span class="total-label">Total Financial Kundali Score</span>
            <span class="total-score"><span class="dash"></span>/ 90</span>
        </div>
        <div class="wheel-heading">Kundali Graha Wheel</div>
        <section class="radar-wrap">
            <svg viewBox="0 0 350 290" width="350" height="290">
                <g fill="none" stroke="#e0e0e0" stroke-width="1">
                    <polygon points="175,45 240,68 268,133 240,198 175,221 110,198 82,133 110,68" />
                    <polygon points="175,70 224,87 245,136 224,185 175,202 126,185 105,136 126,87" />
                    <polygon points="175,95 208,106 222,139 208,172 175,183 142,172 128,139 142,106" />
                    <polygon points="175,120 192,125 199,142 192,159 175,164 158,159 151,142 158,125" />
                </g>
                <g fill="none" stroke="#cccccc" stroke-width="0.8" stroke-dasharray="2,2">
                    <line x1="175" y1="145" x2="175" y2="45" />
                    <line x1="175" y1="145" x2="240" y2="68" />
                    <line x1="175" y1="145" x2="268" y2="133" />
                    <line x1="175" y1="145" x2="240" y2="198" />
                    <line x1="175" y1="145" x2="175" y2="221" />
                    <line x1="175" y1="145" x2="110" y2="198" />
                    <line x1="175" y1="145" x2="82" y2="133" />
                    <line x1="175" y1="145" x2="110" y2="68" />
                </g>
                <g></g>
                <g class="radar-label">
                    <text x="175" y="38" text-anchor="middle">Surya</text>
                    <text x="248" y="62" text-anchor="start">Ketu</text>
                    <text x="276" y="136" text-anchor="start">Rahu</text>
                    <text x="248" y="210" text-anchor="start">Shani</text>
                    <text x="175" y="234" text-anchor="middle">Shukra</text>
                    <text x="102" y="210" text-anchor="end">Guru</text>
                    <text x="74" y="136" text-anchor="end">Budh</text>
                    <text x="102" y="62" text-anchor="end">Mangal</text>
                </g>
            </svg>
        </section>
        <section class="remedy-table">
            <div class="remedy-table-heading">Top Priority Remedies</div>
            <table>
                <thead>
                    <tr>
                        <th class="col-num">#</th>
                        <th style="width: 25%;">Graha Pillar</th>
                        <th style="width: 32%;">Primary Focus Area</th>
                        <th style="width: 35%;">Recommended Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td class="col-num">1</td><td></td><td></td><td></td></tr>
                    <tr><td class="col-num">2</td><td></td><td></td><td></td></tr>
                    <tr><td class="col-num">3</td><td></td><td></td><td></td></tr>
                    <tr><td class="col-num">4</td><td></td><td></td><td></td></tr>
                    <tr><td class="col-num">5</td><td></td><td></td><td></td></tr>
                </tbody>
            </table>
        </section>
        <footer>Kutumb Advisory LLP</footer>
        <div class="emblem">
            <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#333333" stroke-width="0.8">
                    <rect x="9" y="6" width="28" height="28" transform="rotate(45 23 20)" />
                    <rect x="13" y="10" width="20" height="20" />
                </g>
                <text x="23" y="23" text-anchor="middle" font-size="7">14</text>
            </svg>
        </div>
    </main>
</body>
</html>`

export const PAGE_15_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Advisor Observations &amp; Recommendations</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #eeeeee; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 210mm; height: 297mm; background: #ffffff; position: relative; overflow: hidden; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page-header { position: absolute; top: 4%; left: 5%; width: 90%; height: 26mm; background: #3B414B; border-radius: 4px 16px 16px 4px; padding: 16px 24px; color: #ffffff; display: flex; flex-direction: column; justify-content: center; }
        .page-header h1 { font-size: 18px; font-weight: 700; color: #ffffff; }
        .page-header p { margin-top: 6px; font-size: 12.5px; font-weight: 400; color: #ffffff; opacity: 0.9; }
        .top-observations { position: absolute; top: 14.5%; left: 5%; width: 90%; display: grid; grid-template-columns: 1fr 1fr; gap: 4%; }
        .strengths-box, .concerns-box { border: 1px solid #dddddd; border-radius: 6px; overflow: hidden; background: #FFFFFF; }
        .strengths-box h2, .concerns-box h2 { background: #f7f6f4; font-size: 12.5px; font-weight: 700; color: #172A4A; padding: 8px 14px; border-bottom: 1px solid #dddddd; }
        .strengths-box .content, .concerns-box .content { padding: 12px 14px; min-height: 26mm; display: flex; flex-direction: column; gap: 8px; }
        .point-item { font-size: 11px; color: #172A4A; font-weight: 500; line-height: 1.45; }
        .section-heading { font-size: 13px; font-weight: 700; color: #172A4A; margin-bottom: 14px; }
        .remedy-plan { position: absolute; top: 39.5%; left: 5%; width: 90%; }
        .remedy-plan table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #dddddd; margin-top: 0; }
        .remedy-plan th { background: #f7f6f4; font-size: 11.5px; font-weight: 700; color: #172A4A; text-align: left; padding: 8px 12px; border-bottom: 1px solid #dddddd; border-right: 1px solid #dddddd; }
        .remedy-plan td { font-size: 11px; padding: 8px 12px; border-bottom: 1px solid #e6e6e6; border-right: 1px solid #dddddd; vertical-align: middle; line-height: 1.45; }
        .remedy-plan tr:last-child td { border-bottom: 1px solid #dddddd; }
        .remedy-plan th:last-child, .remedy-plan td:last-child { border-right: none; }
        .recommended-products { position: absolute; top: 72%; left: 5%; width: 90%; }
        .products-box { margin-top: 0; border: 1px solid #dddddd; border-radius: 6px; padding: 12px 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 20px; background: #FFFFFF; }
        .products-box .product-field { font-size: 11px; font-weight: 500; color: #172A4A; line-height: 1.4; }
        .advisor-signoff { position: absolute; top: 85.5%; left: 5%; width: 90%; }
        .signoff-grid { margin-top: 0; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
        .signoff-field { display: flex; flex-direction: column; background: #F7F8FA; padding: 10px 14px; border-radius: 6px; border: 1px solid #E2E8F0; }
        .signoff-field .sign-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .signoff-field .sign-val { font-size: 11.5px; font-weight: 600; color: #172A4A; }
        footer { position: absolute; bottom: 3.5%; left: 5%; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: #111111; }
        .emblem { position: absolute; bottom: 3%; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; }
        .emblem svg { width: 100%; height: 100%; }
        .emblem text { font-size: 7px; font-weight: 600; fill: #333333; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <main class="page">
        <header class="page-header">
            <h1>Advisor Observations &amp; Recommendations</h1>
            <p>Professional findings for this family</p>
        </header>
        <section class="top-observations">
            <div class="strengths-box">
                <h2>Financial Strengths</h2>
                <div class="content">
                    <div class="point-item">• Strong commitment to long-term financial security</div>
                    <div class="point-item">• Low default risk across debt obligations</div>
                    <div class="point-item">• Regular income growth trajectory</div>
                </div>
            </div>
            <div class="concerns-box">
                <h2>Key Concerns</h2>
                <div class="content">
                    <div class="point-item">• Inadequate emergency liquid fund buffer</div>
                    <div class="point-item">• Need to optimize life and health insurance cover</div>
                    <div class="point-item">• Retirement corpus gap requires step-up investment</div>
                </div>
            </div>
        </section>
        <section class="remedy-plan">
            <div class="section-heading">90-Day Financial Remedy Plan</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 14%;">Priority</th>
                        <th style="width: 48%;">Action Item</th>
                        <th style="width: 18%;">Timeline</th>
                        <th style="width: 20%;">Owner</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="font-weight: 700; color: #C62828;">High</td>
                        <td>Build emergency liquid buffer (3–6 months expenses)</td>
                        <td>0–60 days</td>
                        <td>Client / Advisor</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #C62828;">High</td>
                        <td>Activate / increase pure term life insurance cover</td>
                        <td>0–30 days</td>
                        <td>Client / Advisor</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #EF6C00;">Medium</td>
                        <td>Start or increase monthly equity SIP investments</td>
                        <td>30–60 days</td>
                        <td>Client / Advisor</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #EF6C00;">Medium</td>
                        <td>Health insurance review and upgrade</td>
                        <td>30–60 days</td>
                        <td>Client / Advisor</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #EF6C00;">Medium</td>
                        <td>Retirement gap calculation and NPS plan</td>
                        <td>60–90 days</td>
                        <td>Client / Advisor</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #2E7D32;">Plan</td>
                        <td>Draft registered Will &amp; update nominations</td>
                        <td>60–90 days</td>
                        <td>Client / Advisor</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="recommended-products">
            <div class="section-heading">Recommended Products / Solutions</div>
            <div class="products-box">
                <div class="product-field">1. Pure Term Life Cover (10-15x Income)</div>
                <div class="product-field">2. Emergency Reserve (3-6 Months)</div>
                <div class="product-field">3. Goal-Based Equity SIP Portfolio</div>
                <div class="product-field">4. Family Health Floater Cover (₹10-25L)</div>
                <div class="product-field">5. Retirement NPS / Corpus Build-up</div>
                <div class="product-field">6. Registered Will &amp; Nomination Update</div>
            </div>
        </section>
        <section class="advisor-signoff">
            <div class="section-heading">Advisor Sign-off</div>
            <div class="signoff-grid">
                <div class="signoff-field">
                    <span class="sign-label">Advisor Name</span>
                    <span class="sign-val">Kutumb Wealth Advisor</span>
                </div>
                <div class="signoff-field">
                    <span class="sign-label">Signature</span>
                    <span class="sign-val">[Verified Digital]</span>
                </div>
                <div class="signoff-field">
                    <span class="sign-label">Date</span>
                    <span class="sign-val sign-date-val"></span>
                </div>
                <div class="signoff-field">
                    <span class="sign-label">Client Name</span>
                    <span class="sign-val sign-client-val"></span>
                </div>
            </div>
        </section>
        <footer>Kutumb Advisory LLP</footer>
        <div class="emblem">
            <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#333333" stroke-width="0.8">
                    <rect x="9" y="6" width="28" height="28" transform="rotate(45 23 20)" />
                    <rect x="13" y="10" width="20" height="20" />
                </g>
                <text x="23" y="23" text-anchor="middle" font-size="7">15</text>
            </svg>
        </div>
    </main>
</body>
</html>`
