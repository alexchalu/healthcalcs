#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const existing = new Set(['arizona','california','colorado','connecticut','florida','georgia','illinois','maryland','massachusetts','michigan','new-jersey','new-york','north-carolina','ohio','pennsylvania','tennessee','texas','virginia','washington','wisconsin']);

// All 50 states with property tax data
const allStates = [
  { abbr: 'AL', name: 'Alabama', rate: 0.40, median: 172800, slug: 'alabama' },
  { abbr: 'AK', name: 'Alaska', rate: 1.04, median: 305400, slug: 'alaska' },
  { abbr: 'AR', name: 'Arkansas', rate: 0.62, median: 162100, slug: 'arkansas' },
  { abbr: 'DE', name: 'Delaware', rate: 0.53, median: 305200, slug: 'delaware' },
  { abbr: 'HI', name: 'Hawaii', rate: 0.27, median: 722500, slug: 'hawaii' },
  { abbr: 'ID', name: 'Idaho', rate: 0.63, median: 362400, slug: 'idaho' },
  { abbr: 'IN', name: 'Indiana', rate: 0.81, median: 182400, slug: 'indiana' },
  { abbr: 'IA', name: 'Iowa', rate: 1.52, median: 178500, slug: 'iowa' },
  { abbr: 'KS', name: 'Kansas', rate: 1.33, median: 195000, slug: 'kansas' },
  { abbr: 'KY', name: 'Kentucky', rate: 0.83, median: 173600, slug: 'kentucky' },
  { abbr: 'LA', name: 'Louisiana', rate: 0.55, median: 198000, slug: 'louisiana' },
  { abbr: 'ME', name: 'Maine', rate: 1.24, median: 272500, slug: 'maine' },
  { abbr: 'MN', name: 'Minnesota', rate: 1.05, median: 296100, slug: 'minnesota' },
  { abbr: 'MS', name: 'Mississippi', rate: 0.65, median: 148100, slug: 'mississippi' },
  { abbr: 'MO', name: 'Missouri', rate: 0.91, median: 199600, slug: 'missouri' },
  { abbr: 'MT', name: 'Montana', rate: 0.74, median: 355600, slug: 'montana' },
  { abbr: 'NE', name: 'Nebraska', rate: 1.65, median: 206100, slug: 'nebraska' },
  { abbr: 'NV', name: 'Nevada', rate: 0.53, median: 388800, slug: 'nevada' },
  { abbr: 'NH', name: 'New Hampshire', rate: 1.86, median: 361700, slug: 'new-hampshire' },
  { abbr: 'NM', name: 'New Mexico', rate: 0.67, median: 247400, slug: 'new-mexico' },
  { abbr: 'ND', name: 'North Dakota', rate: 0.94, median: 232000, slug: 'north-dakota' },
  { abbr: 'OK', name: 'Oklahoma', rate: 0.87, median: 175800, slug: 'oklahoma' },
  { abbr: 'OR', name: 'Oregon', rate: 0.87, median: 423800, slug: 'oregon' },
  { abbr: 'RI', name: 'Rhode Island', rate: 1.40, median: 382100, slug: 'rhode-island' },
  { abbr: 'SC', name: 'South Carolina', rate: 0.55, median: 230700, slug: 'south-carolina' },
  { abbr: 'SD', name: 'South Dakota', rate: 1.14, median: 232200, slug: 'south-dakota' },
  { abbr: 'UT', name: 'Utah', rate: 0.52, median: 420500, slug: 'utah' },
  { abbr: 'VT', name: 'Vermont', rate: 1.83, median: 275400, slug: 'vermont' },
  { abbr: 'WV', name: 'West Virginia', rate: 0.57, median: 128600, slug: 'west-virginia' },
  { abbr: 'WY', name: 'Wyoming', rate: 0.56, median: 286000, slug: 'wyoming' },
];

const newStates = allStates.filter(s => !existing.has(s.slug));

const dir = path.join(__dirname, 'property-tax');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function dollar(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

// Use all states for cross-linking
const crossLinkStates = allStates;

let generated = 0;
for (const st of newStates) {
  const annualTax = Math.round(st.median * st.rate / 100);
  const monthlyTax = Math.round(annualTax / 12);
  const otherStates = crossLinkStates.filter(s => s.abbr !== st.abbr).slice(0, 10);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${st.name} Property Tax Calculator 2026 - Free ${st.abbr} Tax Estimator</title>
    <meta name="description" content="Calculate property taxes in ${st.name}. Free ${st.abbr} property tax estimator with ${st.name} tax rate of ${st.rate}%. Estimate annual and monthly property tax bills.">
    <meta name="keywords" content="${st.name} property tax, ${st.abbr} property tax calculator, ${st.name} property tax rate, ${st.name} real estate tax">
    <link rel="canonical" href="https://alexchalu.github.io/healthcalcs/property-tax/${st.slug}-property-tax.html">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${st.name} Property Tax Calculator",
      "url": "https://alexchalu.github.io/healthcalcs/property-tax/${st.slug}-property-tax.html",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description": "Calculate property taxes in ${st.name} (${st.abbr}). Effective tax rate: ${st.rate}%."
    }
    </script>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      :root{--bg:#0c1222;--surface:#162032;--border:#1e3a5f;--text:#e2e8f0;--muted:#8899aa;--accent:#10b981;--accent2:#06b6d4}
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
      .container{max-width:860px;margin:0 auto;padding:20px}
      h1{font-size:2em;margin:30px 0 10px;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      h2{color:var(--accent);margin:28px 0 14px;font-size:1.4em}
      h3{color:var(--accent2);margin:20px 0 10px}
      p,li{color:var(--text);margin-bottom:10px}
      .calc-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px;margin:24px 0}
      .input-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}
      @media(max-width:600px){.input-row{grid-template-columns:1fr}}
      label{display:block;font-weight:600;margin-bottom:6px;color:var(--muted);font-size:0.9em}
      input,select{width:100%;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:1rem}
      input:focus,select:focus{outline:none;border-color:var(--accent)}
      .btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;padding:14px;border-radius:8px;font-size:1.1rem;font-weight:600;cursor:pointer;width:100%;margin-top:16px}
      .btn:hover{opacity:0.9}
      .result{background:var(--surface);border:1px solid var(--accent);border-radius:12px;padding:24px;margin:24px 0;display:none}
      .result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin:16px 0}
      .result-item{text-align:center;padding:16px;background:var(--bg);border-radius:8px}
      .result-item .val{font-size:1.8em;font-weight:700;color:var(--accent)}
      .result-item .lbl{color:var(--muted);font-size:0.85em;margin-top:4px}
      .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:20px 0}
      .stat{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px;text-align:center}
      .stat .v{font-size:1.5em;font-weight:700;color:var(--accent2)}
      .stat .l{color:var(--muted);font-size:0.85em}
      .links{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
      .links a{background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:20px;color:var(--accent);text-decoration:none;font-size:0.9em}
      .links a:hover{border-color:var(--accent);background:rgba(16,185,129,0.1)}
      .ad-slot{margin:24px 0;min-height:90px;text-align:center}
      .info-box{background:rgba(16,185,129,0.08);border-left:3px solid var(--accent);padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border)}
      th{color:var(--accent);font-weight:600;background:var(--surface)}
      td{color:var(--text)}
      footer{text-align:center;padding:40px 0;color:var(--muted);border-top:1px solid var(--border);margin-top:40px}
      footer a{color:var(--accent);text-decoration:none}
      .breadcrumb{color:var(--muted);font-size:0.9em;margin:10px 0}
      .breadcrumb a{color:var(--accent);text-decoration:none}
    </style>
</head>
<body>
<div class="container">
    <div class="breadcrumb"><a href="../index.html">HealthCalcs</a> → <a href="index.html">Property Tax</a> → ${st.name}</div>
    <h1>🏠 ${st.name} Property Tax Calculator</h1>
    <p>Calculate your property tax bill in ${st.name} (${st.abbr}). The average effective property tax rate in ${st.name} is <strong>${st.rate}%</strong>, with a median home value of <strong>${dollar(st.median)}</strong>.</p>

    <div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <div class="calc-card">
        <h2>Calculate Your ${st.abbr} Property Tax</h2>
        <div class="input-row">
            <div><label>Property Value ($)</label><input type="number" id="propValue" value="${st.median}" min="10000" step="1000"></div>
            <div><label>Tax Rate (%)</label><input type="number" id="taxRate" value="${st.rate}" step="0.01" min="0"></div>
        </div>
        <div class="input-row">
            <div><label>Homestead Exemption ($)</label><input type="number" id="exemption" value="0" min="0" step="1000"></div>
            <div><label>Assessment Ratio (%)</label><input type="number" id="assessRatio" value="100" min="1" max="100" step="1"></div>
        </div>
        <button class="btn" onclick="calc()">Calculate Property Tax</button>
    </div>

    <div class="result" id="result">
        <h3>Your ${st.name} Property Tax Estimate</h3>
        <div class="result-grid">
            <div class="result-item"><div class="val" id="rAnnual">-</div><div class="lbl">Annual Tax</div></div>
            <div class="result-item"><div class="val" id="rMonthly">-</div><div class="lbl">Monthly</div></div>
            <div class="result-item"><div class="val" id="rEffective">-</div><div class="lbl">Effective Rate</div></div>
            <div class="result-item"><div class="val" id="rAssessed">-</div><div class="lbl">Assessed Value</div></div>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat"><div class="v">${st.rate}%</div><div class="l">Avg Tax Rate</div></div>
        <div class="stat"><div class="v">${dollar(st.median)}</div><div class="l">Median Home Value</div></div>
        <div class="stat"><div class="v">${dollar(annualTax)}</div><div class="l">Avg Annual Tax</div></div>
        <div class="stat"><div class="v">${dollar(monthlyTax)}/mo</div><div class="l">Avg Monthly Tax</div></div>
    </div>

    <div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <h2>📊 ${st.name} Property Tax by Home Value</h2>
    <table>
        <thead><tr><th>Home Value</th><th>Annual Tax</th><th>Monthly</th></tr></thead>
        <tbody>
        ${[150000,200000,250000,300000,350000,400000,500000,600000,750000,1000000].map(v => {
          const t = Math.round(v * st.rate / 100);
          return `<tr><td>${dollar(v)}</td><td>${dollar(t)}</td><td>${dollar(Math.round(t/12))}</td></tr>`;
        }).join('\n        ')}
        </tbody>
    </table>

    <h2>ℹ️ About ${st.name} Property Taxes</h2>
    <div class="info-box">
        <p><strong>${st.name}'s effective property tax rate is ${st.rate}%</strong>, which is ${st.rate < 1.0 ? 'below' : 'above'} the national average of ~1.07%. On a home worth ${dollar(st.median)}, that means an average annual tax bill of ${dollar(annualTax)}.</p>
    </div>
    <p>Property taxes in ${st.name} fund local schools, roads, fire departments, and municipal services. Tax rates vary by county and municipality. Use the calculator above to estimate your specific property tax bill.</p>
    <h3>How ${st.name} Property Tax Works</h3>
    <ul style="padding-left:20px;margin:12px 0">
        <li><strong>Assessment:</strong> Properties are assessed by county assessors, typically at or near market value.</li>
        <li><strong>Tax Rate (Mill Rate):</strong> Local governments set rates based on budgets. Rates vary widely by county.</li>
        <li><strong>Exemptions:</strong> Many ${st.name} homeowners qualify for homestead exemptions that reduce taxable value.</li>
        <li><strong>Appeals:</strong> Homeowners can appeal their assessed value if they believe it's too high.</li>
        <li><strong>Payment:</strong> Property taxes are typically due in annual or semi-annual installments.</li>
    </ul>

    <h3>Tips to Lower Your ${st.name} Property Tax</h3>
    <ul style="padding-left:20px;margin:12px 0">
        <li>Apply for all available exemptions (homestead, senior, veteran, disability)</li>
        <li>Review your assessment and appeal if your home is over-valued</li>
        <li>Compare your assessed value to recent comparable sales</li>
        <li>Check for errors in your property's records (square footage, lot size)</li>
        <li>Understand deadlines — missing the appeal window means waiting another year</li>
    </ul>

    <div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <h2>Property Tax Calculators by State</h2>
    <div class="links">
        ${otherStates.map(s => `<a href="${s.slug}-property-tax.html">${s.name}</a>`).join('\n        ')}
    </div>

    <div style="margin:24px 0">
        <p><strong>More Calculators:</strong></p>
        <div class="links">
            <a href="../bmi-calculator.html">BMI Calculator</a>
            <a href="../life-insurance-calculator.html">Life Insurance</a>
            <a href="../health-insurance-cost.html">Health Insurance</a>
            <a href="https://alexchalu.github.io/smartcalc/">SmartCalc Finance</a>
            <a href="https://alexchalu.github.io/toolpulse/">ToolPulse</a>
        </div>
    </div>

    <footer>
        <p><a href="../index.html">HealthCalcs</a> — Free Calculators</p>
        <p style="margin-top:8px">⚠️ For informational purposes only. Consult a tax professional for advice.</p>
    </footer>
</div>
<script>
function calc(){
    const v=parseFloat(document.getElementById('propValue').value)||0;
    const r=parseFloat(document.getElementById('taxRate').value)||0;
    const e=parseFloat(document.getElementById('exemption').value)||0;
    const a=parseFloat(document.getElementById('assessRatio').value)||100;
    const assessed=Math.max(0,(v*(a/100))-e);
    const annual=assessed*r/100;
    const monthly=annual/12;
    const eff=(v>0)?(annual/v*100):0;
    document.getElementById('rAnnual').textContent='$'+Math.round(annual).toLocaleString();
    document.getElementById('rMonthly').textContent='$'+Math.round(monthly).toLocaleString();
    document.getElementById('rEffective').textContent=eff.toFixed(2)+'%';
    document.getElementById('rAssessed').textContent='$'+Math.round(assessed).toLocaleString();
    document.getElementById('result').style.display='block';
}
calc();
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, `${st.slug}-property-tax.html`), html);
  console.log(`✅ ${st.name} property tax calculator`);
  generated++;
}

console.log(`\nGenerated ${generated} new property tax pages`);
console.log(`Total property tax pages: ${generated + existing.size + 1} (incl index)`);
