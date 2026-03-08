#!/usr/bin/env node
// Generate state-specific property tax calculator pages

const fs = require('fs');
const path = require('path');

const states = [
  { abbr: 'CA', name: 'California', rate: 0.73, median: 546800, slug: 'california' },
  { abbr: 'TX', name: 'Texas', rate: 1.60, median: 238000, slug: 'texas' },
  { abbr: 'FL', name: 'Florida', rate: 0.86, median: 392300, slug: 'florida' },
  { abbr: 'NY', name: 'New York', rate: 1.40, median: 384100, slug: 'new-york' },
  { abbr: 'PA', name: 'Pennsylvania', rate: 1.36, median: 240800, slug: 'pennsylvania' },
  { abbr: 'IL', name: 'Illinois', rate: 2.08, median: 239100, slug: 'illinois' },
  { abbr: 'OH', name: 'Ohio', rate: 1.59, median: 183300, slug: 'ohio' },
  { abbr: 'GA', name: 'Georgia', rate: 0.83, median: 275400, slug: 'georgia' },
  { abbr: 'NC', name: 'North Carolina', rate: 0.77, median: 265000, slug: 'north-carolina' },
  { abbr: 'MI', name: 'Michigan', rate: 1.38, median: 201100, slug: 'michigan' },
  { abbr: 'NJ', name: 'New Jersey', rate: 2.23, median: 401400, slug: 'new-jersey' },
  { abbr: 'VA', name: 'Virginia', rate: 0.82, median: 339800, slug: 'virginia' },
  { abbr: 'WA', name: 'Washington', rate: 0.84, median: 504600, slug: 'washington' },
  { abbr: 'AZ', name: 'Arizona', rate: 0.51, median: 349300, slug: 'arizona' },
  { abbr: 'MA', name: 'Massachusetts', rate: 1.15, median: 524100, slug: 'massachusetts' },
  { abbr: 'CO', name: 'Colorado', rate: 0.49, median: 465100, slug: 'colorado' },
  { abbr: 'TN', name: 'Tennessee', rate: 0.56, median: 254600, slug: 'tennessee' },
  { abbr: 'MD', name: 'Maryland', rate: 0.99, median: 370200, slug: 'maryland' },
  { abbr: 'WI', name: 'Wisconsin', rate: 1.61, median: 230400, slug: 'wisconsin' },
  { abbr: 'CT', name: 'Connecticut', rate: 1.96, median: 315700, slug: 'connecticut' },
];

const dir = path.join(__dirname, 'property-tax');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function fmt(n) { return n.toLocaleString('en-US'); }
function dollar(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

states.forEach(st => {
  const annualTax = Math.round(st.median * st.rate / 100);
  const monthlyTax = Math.round(annualTax / 12);
  const otherStates = states.filter(s => s.abbr !== st.abbr).slice(0, 10);

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
});

// Generate index page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Tax Calculator by State 2026 - All 50 States</title>
    <meta name="description" content="Free property tax calculators for every state. Calculate property taxes, compare rates, find exemptions. Updated for 2026.">
    <meta name="keywords" content="property tax calculator, property tax by state, real estate tax calculator, property tax rates 2026">
    <link rel="canonical" href="https://alexchalu.github.io/healthcalcs/property-tax/">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      :root{--bg:#0c1222;--surface:#162032;--border:#1e3a5f;--text:#e2e8f0;--muted:#8899aa;--accent:#10b981;--accent2:#06b6d4}
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
      .container{max-width:960px;margin:0 auto;padding:20px}
      h1{font-size:2.2em;margin:30px 0 10px;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      h2{color:var(--accent);margin:28px 0 14px}
      p{margin-bottom:12px}
      .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin:20px 0}
      .card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px;text-decoration:none;color:var(--text);transition:all .2s;display:block}
      .card:hover{border-color:var(--accent);transform:translateY(-2px)}
      .card h3{font-size:1em;margin-bottom:4px;color:var(--accent2)}
      .card .rate{font-size:1.4em;font-weight:700;color:var(--accent)}
      .card .detail{color:var(--muted);font-size:0.85em;margin-top:4px}
      .ad-slot{margin:24px 0;min-height:90px}
      .breadcrumb{color:var(--muted);font-size:0.9em;margin:10px 0}
      .breadcrumb a{color:var(--accent);text-decoration:none}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border)}
      th{color:var(--accent);font-weight:600;background:var(--surface)}
      footer{text-align:center;padding:40px 0;color:var(--muted);border-top:1px solid var(--border);margin-top:40px}
      footer a{color:var(--accent);text-decoration:none}
    </style>
</head>
<body>
<div class="container">
    <div class="breadcrumb"><a href="../index.html">HealthCalcs</a> → Property Tax Calculators</div>
    <h1>🏠 Property Tax Calculator by State</h1>
    <p>Calculate property taxes for any state. Compare effective tax rates, median home values, and average annual tax bills across the US.</p>

    <div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <h2>Property Tax Rates by State (2026)</h2>
    <table>
        <thead><tr><th>State</th><th>Tax Rate</th><th>Median Home</th><th>Avg Annual Tax</th></tr></thead>
        <tbody>
        ${states.sort((a,b) => b.rate - a.rate).map(s => {
          const t = Math.round(s.median * s.rate / 100);
          return `<tr><td><a href="${s.slug}-property-tax.html" style="color:var(--accent2);text-decoration:none">${s.name}</a></td><td>${s.rate}%</td><td>$${s.median.toLocaleString()}</td><td>$${t.toLocaleString()}</td></tr>`;
        }).join('\n        ')}
        </tbody>
    </table>

    <div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <h2>Calculate Your Property Tax</h2>
    <div class="grid">
    ${states.sort((a,b) => a.name.localeCompare(b.name)).map(s => {
      const t = Math.round(s.median * s.rate / 100);
      return `<a href="${s.slug}-property-tax.html" class="card"><h3>${s.name} (${s.abbr})</h3><div class="rate">${s.rate}%</div><div class="detail">Median: $${s.median.toLocaleString()} · Avg Tax: $${t.toLocaleString()}/yr</div></a>`;
    }).join('\n    ')}
    </div>

    <div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

    <h2>Understanding Property Taxes</h2>
    <p>Property taxes are the primary revenue source for local governments, funding schools, roads, police, and fire departments. Rates vary significantly by state and county.</p>
    <ul style="padding-left:20px;margin:12px 0">
        <li><strong>Highest rates:</strong> New Jersey (2.23%), Illinois (2.08%), Connecticut (1.96%)</li>
        <li><strong>Lowest rates:</strong> Colorado (0.49%), Arizona (0.51%), Tennessee (0.56%)</li>
        <li><strong>Most expensive:</strong> New Jersey ($8,951/yr), Massachusetts ($6,027/yr), Connecticut ($6,188/yr)</li>
    </ul>

    <div style="margin:24px 0">
        <p><strong>More Calculators:</strong></p>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
            <a href="../state/" style="background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:20px;color:var(--accent);text-decoration:none">Health Insurance by State</a>
            <a href="../life-insurance-calculator.html" style="background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:20px;color:var(--accent);text-decoration:none">Life Insurance</a>
            <a href="https://alexchalu.github.io/smartcalc/" style="background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:20px;color:var(--accent);text-decoration:none">SmartCalc Finance</a>
            <a href="https://alexchalu.github.io/toolpulse/" style="background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:20px;color:var(--accent);text-decoration:none">ToolPulse</a>
        </div>
    </div>

    <footer>
        <p><a href="../index.html">HealthCalcs</a> — Free Calculators</p>
        <p style="margin-top:8px">⚠️ For informational purposes only. Consult a tax professional for advice.</p>
    </footer>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
console.log('✅ Property Tax index page');
console.log(`\nTotal: ${states.length} state pages + 1 index = ${states.length + 1} pages`);
