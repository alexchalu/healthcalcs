#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// States to add (high-population / high-CPC, not already built)
const states = [
  { name: 'Arizona', abbr: 'AZ', slug: 'arizona', avgPremium: 1820, minCoverage: '25/50/15', avgMonthly: 152 },
  { name: 'Colorado', abbr: 'CO', slug: 'colorado', avgPremium: 2050, minCoverage: '25/50/15', avgMonthly: 171 },
  { name: 'Connecticut', abbr: 'CT', slug: 'connecticut', avgPremium: 2280, minCoverage: '25/50/25', avgMonthly: 190 },
  { name: 'Indiana', abbr: 'IN', slug: 'indiana', avgPremium: 1540, minCoverage: '25/50/25', avgMonthly: 128 },
  { name: 'Maryland', abbr: 'MD', slug: 'maryland', avgPremium: 1980, minCoverage: '30/60/15', avgMonthly: 165 },
  { name: 'Massachusetts', abbr: 'MA', slug: 'massachusetts', avgPremium: 1650, minCoverage: '20/40/5', avgMonthly: 138 },
  { name: 'Minnesota', abbr: 'MN', slug: 'minnesota', avgPremium: 1720, minCoverage: '30/60/10', avgMonthly: 143 },
  { name: 'Missouri', abbr: 'MO', slug: 'missouri', avgPremium: 1890, minCoverage: '25/50/25', avgMonthly: 158 },
  { name: 'Nevada', abbr: 'NV', slug: 'nevada', avgPremium: 2150, minCoverage: '25/50/20', avgMonthly: 179 },
  { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina', avgPremium: 1480, minCoverage: '30/60/25', avgMonthly: 123 },
  { name: 'Oregon', abbr: 'OR', slug: 'oregon', avgPremium: 1620, minCoverage: '25/50/20', avgMonthly: 135 },
  { name: 'South Carolina', abbr: 'SC', slug: 'south-carolina', avgPremium: 1950, minCoverage: '25/50/25', avgMonthly: 163 },
  { name: 'Tennessee', abbr: 'TN', slug: 'tennessee', avgPremium: 1680, minCoverage: '25/50/15', avgMonthly: 140 },
  { name: 'Virginia', abbr: 'VA', slug: 'virginia', avgPremium: 1560, minCoverage: '25/50/20', avgMonthly: 130 },
  { name: 'Washington', abbr: 'WA', slug: 'washington', avgPremium: 1740, minCoverage: '25/50/10', avgMonthly: 145 },
];

const template = (s) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.name} Auto Insurance Calculator 2026 - Free Car Insurance Estimate</title>
    <meta name="description" content="Calculate car insurance costs in ${s.name}. Free ${s.abbr} auto insurance calculator with coverage options, discounts, and average rates for 2026.">
    <meta name="keywords" content="${s.name} auto insurance, ${s.abbr} car insurance calculator, ${s.name} car insurance cost, cheap car insurance ${s.abbr}, ${s.name} auto insurance rates 2026">
    <link rel="canonical" href="https://alexchalu.github.io/healthcalcs/auto/${s.slug}-auto-insurance.html">
    <link rel="stylesheet" href="/healthcalcs/style.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <style>
      .auto-container { max-width: 900px; margin: 2rem auto; padding: 0 2rem; }
      .calc-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 2rem 0; }
      .input-group { margin: 1.5rem 0; }
      .input-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #34495e; }
      .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; }
      .calc-button { background: #e74c3c; color: white; border: none; padding: 1rem 2rem; border-radius: 6px; font-size: 1.1rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem; }
      .calc-button:hover { background: #c0392b; }
      .result-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 2rem; margin: 2rem 0; border-radius: 6px; display: none; }
      .result-value { font-size: 2.5rem; font-weight: bold; color: #1b5e20; margin: 1rem 0; }
      .coverage-table { width: 100%; margin: 1.5rem 0; border-collapse: collapse; }
      .coverage-table th, .coverage-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
      .coverage-table th { background: #f8f9fa; font-weight: 600; }
      .ad-container { margin: 2rem 0; text-align: center; min-height: 90px; }
      .info-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 1.5rem; margin: 2rem 0; border-radius: 6px; }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
      .stat-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; }
      .stat-card .value { font-size: 1.8rem; font-weight: bold; color: #e74c3c; }
      .faq-section { margin: 2rem 0; }
      .faq-item { border: 1px solid #e0e0e0; border-radius: 8px; margin: 1rem 0; overflow: hidden; }
      .faq-q { padding: 1rem 1.5rem; font-weight: 600; cursor: pointer; background: #f8f9fa; }
      .faq-a { padding: 1rem 1.5rem; display: none; }
      .faq-item.open .faq-a { display: block; }
      .cross-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin: 1.5rem 0; }
      .cross-links a { display: block; padding: 0.75rem; background: #f0f4f8; border-radius: 6px; text-decoration: none; color: #2c3e50; font-weight: 500; text-align: center; }
      .cross-links a:hover { background: #e74c3c; color: white; }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${s.name} Auto Insurance Calculator",
      "description": "Calculate car insurance costs in ${s.name} (${s.abbr})",
      "url": "https://alexchalu.github.io/healthcalcs/auto/${s.slug}-auto-insurance.html",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web"
    }
    </script>
</head>
<body>
    <div class="auto-container">
        <h1>🚗 ${s.name} Auto Insurance Calculator</h1>
        <p>Calculate car insurance costs in ${s.name} (${s.abbr}). Get estimated premiums based on your coverage needs, vehicle type, and driver profile for 2026.</p>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="stat-grid">
            <div class="stat-card">
                <div class="value">$${s.avgPremium.toLocaleString()}</div>
                <div>Avg. ${s.abbr} Premium/Year</div>
            </div>
            <div class="stat-card">
                <div class="value">${s.minCoverage}</div>
                <div>Min. Coverage Required</div>
            </div>
            <div class="stat-card">
                <div class="value">$${s.avgMonthly}</div>
                <div>Avg. Monthly Payment</div>
            </div>
        </div>

        <div class="calc-card">
            <h2>Calculate Your ${s.abbr} Auto Insurance Cost</h2>
            
            <div class="input-group">
                <label>Your Age</label>
                <select id="age">
                    <option value="18">18-24</option>
                    <option value="30" selected>25-35</option>
                    <option value="40">36-50</option>
                    <option value="55">51-65</option>
                    <option value="70">65+</option>
                </select>
            </div>

            <div class="input-group">
                <label>Driving Record</label>
                <select id="record">
                    <option value="clean" selected>Clean (no tickets/accidents)</option>
                    <option value="ticket">1 ticket in past 3 years</option>
                    <option value="accident">1 accident in past 3 years</option>
                    <option value="multiple">Multiple tickets/accidents</option>
                </select>
            </div>

            <div class="input-group">
                <label>Vehicle Type</label>
                <select id="vehicle">
                    <option value="sedan" selected>Sedan</option>
                    <option value="suv">SUV / Crossover</option>
                    <option value="truck">Truck</option>
                    <option value="sports">Sports Car</option>
                    <option value="luxury">Luxury Vehicle</option>
                    <option value="ev">Electric Vehicle</option>
                </select>
            </div>

            <div class="input-group">
                <label>Coverage Level</label>
                <select id="coverage">
                    <option value="minimum">State Minimum (${s.minCoverage})</option>
                    <option value="standard" selected>Standard (50/100/50)</option>
                    <option value="full">Full Coverage (100/300/100)</option>
                    <option value="premium">Premium (250/500/250 + Umbrella)</option>
                </select>
            </div>

            <div class="input-group">
                <label>Credit Score Range</label>
                <select id="credit">
                    <option value="excellent">Excellent (750+)</option>
                    <option value="good" selected>Good (700-749)</option>
                    <option value="fair">Fair (650-699)</option>
                    <option value="poor">Poor (Below 650)</option>
                </select>
            </div>

            <button class="calc-button" onclick="calculate()">Calculate My ${s.abbr} Insurance Cost</button>
        </div>

        <div class="result-box" id="result">
            <h3>Your Estimated ${s.name} Auto Insurance Cost</h3>
            <div class="result-value" id="annual">$0</div>
            <p>Estimated annual premium (<span id="monthly">$0</span>/month)</p>
            <table class="coverage-table" id="breakdown">
                <tr><th>Coverage</th><th>Estimated Cost</th></tr>
            </table>
        </div>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567891" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-box">
            <h3>📋 ${s.name} Auto Insurance Requirements</h3>
            <p>${s.name} requires all drivers to carry minimum liability coverage of <strong>${s.minCoverage}</strong> (bodily injury per person / bodily injury per accident / property damage). The average ${s.abbr} driver pays <strong>$${s.avgPremium.toLocaleString()}/year</strong>, but rates vary significantly based on your location within the state, driving history, vehicle, and credit score.</p>
        </div>

        <h2>How ${s.name} Auto Insurance Rates Compare</h2>
        <p>The average auto insurance premium in ${s.name} is <strong>$${s.avgPremium.toLocaleString()}/year</strong>. Here's how different factors affect your rate:</p>
        
        <table class="coverage-table">
            <tr><th>Factor</th><th>Impact on Premium</th></tr>
            <tr><td>Age (18-24 vs 35-50)</td><td>+40-80% higher for young drivers</td></tr>
            <tr><td>Clean vs. accident record</td><td>+25-50% with at-fault accident</td></tr>
            <tr><td>Sports car vs. sedan</td><td>+15-30% for sports vehicles</td></tr>
            <tr><td>Excellent vs. poor credit</td><td>+40-100% for poor credit</td></tr>
            <tr><td>Full vs. minimum coverage</td><td>+60-120% for full coverage</td></tr>
        </table>

        <h2>Tips to Lower Your ${s.name} Auto Insurance</h2>
        <ul>
            <li><strong>Bundle policies</strong> — Combine auto + home for 10-25% discount</li>
            <li><strong>Increase deductible</strong> — Raising from $500 to $1,000 saves 15-25%</li>
            <li><strong>Good driver discount</strong> — Clean record for 3+ years saves 10-20%</li>
            <li><strong>Defensive driving course</strong> — Can save 5-15% in ${s.name}</li>
            <li><strong>Low mileage discount</strong> — Drive under 7,500 miles/year for savings</li>
            <li><strong>Shop annually</strong> — Compare 3-5 quotes every renewal</li>
            <li><strong>Ask about affiliations</strong> — Military, alumni, professional discounts</li>
        </ul>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567892" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="faq-section">
            <h2>Frequently Asked Questions — ${s.name} Auto Insurance</h2>
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-q">What is the minimum auto insurance required in ${s.name}?</div>
                <div class="faq-a">${s.name} requires minimum liability coverage of ${s.minCoverage} — that's $${s.minCoverage.split('/')[0]}k bodily injury per person, $${s.minCoverage.split('/')[1]}k per accident, and $${s.minCoverage.split('/')[2]}k property damage. Most experts recommend higher limits.</div>
            </div>
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-q">How much does auto insurance cost in ${s.name}?</div>
                <div class="faq-a">The average ${s.name} driver pays about $${s.avgPremium.toLocaleString()} per year ($${s.avgMonthly}/month). Your actual rate depends on age, driving history, vehicle, location, and credit score.</div>
            </div>
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-q">How can I get cheap car insurance in ${s.name}?</div>
                <div class="faq-a">Compare quotes from at least 3-5 insurers, maintain a clean driving record, raise your deductible, bundle with home insurance, and ask about all available discounts. Shopping annually can save hundreds.</div>
            </div>
            <div class="faq-item" onclick="this.classList.toggle('open')">
                <div class="faq-q">Does ${s.name} use credit scores for auto insurance?</div>
                <div class="faq-a">Most ${s.name} insurers consider credit-based insurance scores when setting rates. Improving your credit score can significantly lower your premium — sometimes by 30-50%.</div>
            </div>
        </div>

        <h2>Auto Insurance Calculators by State</h2>
        <div class="cross-links" id="state-links"></div>

        <p style="margin-top: 3rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; font-size: 0.85rem; color: #7f8c8d;">
            <strong>Disclaimer:</strong> This calculator provides estimates only. Actual insurance premiums depend on many factors including your specific location within ${s.name}, insurer, coverage details, and personal risk profile. Always get quotes from multiple licensed insurers for accurate pricing.
        </p>

        <p style="text-align: center; margin: 2rem 0;">
            <a href="/healthcalcs/">← Back to HealthCalcs</a> |
            <a href="/healthcalcs/car-insurance-calculator.html">General Car Insurance Calculator</a>
        </p>
    </div>

    <script>
    const BASE = ${s.avgPremium};
    function calculate() {
        const age = parseInt(document.getElementById('age').value);
        const record = document.getElementById('record').value;
        const vehicle = document.getElementById('vehicle').value;
        const coverage = document.getElementById('coverage').value;
        const credit = document.getElementById('credit').value;

        let rate = BASE;
        // Age factor
        if (age <= 20) rate *= 1.65;
        else if (age <= 25) rate *= 1.35;
        else if (age <= 35) rate *= 1.0;
        else if (age <= 50) rate *= 0.92;
        else if (age <= 65) rate *= 0.95;
        else rate *= 1.08;

        // Record
        if (record === 'ticket') rate *= 1.18;
        else if (record === 'accident') rate *= 1.38;
        else if (record === 'multiple') rate *= 1.65;

        // Vehicle
        if (vehicle === 'suv') rate *= 1.08;
        else if (vehicle === 'truck') rate *= 1.05;
        else if (vehicle === 'sports') rate *= 1.25;
        else if (vehicle === 'luxury') rate *= 1.35;
        else if (vehicle === 'ev') rate *= 1.12;

        // Coverage
        let covMult = 1;
        if (coverage === 'minimum') covMult = 0.6;
        else if (coverage === 'full') covMult = 1.55;
        else if (coverage === 'premium') covMult = 2.1;
        rate *= covMult;

        // Credit
        if (credit === 'excellent') rate *= 0.85;
        else if (credit === 'fair') rate *= 1.2;
        else if (credit === 'poor') rate *= 1.55;

        rate = Math.round(rate);
        const monthly = Math.round(rate / 12);

        document.getElementById('annual').textContent = '$' + rate.toLocaleString();
        document.getElementById('monthly').textContent = '$' + monthly.toLocaleString();

        // Breakdown
        const liability = Math.round(rate * 0.45);
        const collision = Math.round(rate * 0.25);
        const comprehensive = Math.round(rate * 0.15);
        const um = Math.round(rate * 0.08);
        const other = rate - liability - collision - comprehensive - um;
        document.getElementById('breakdown').innerHTML = '<tr><th>Coverage</th><th>Estimated Cost</th></tr>' +
            '<tr><td>Liability</td><td>$' + liability.toLocaleString() + '/yr</td></tr>' +
            '<tr><td>Collision</td><td>$' + collision.toLocaleString() + '/yr</td></tr>' +
            '<tr><td>Comprehensive</td><td>$' + comprehensive.toLocaleString() + '/yr</td></tr>' +
            '<tr><td>Uninsured Motorist</td><td>$' + um.toLocaleString() + '/yr</td></tr>' +
            '<tr><td>Other (PIP, Medical)</td><td>$' + other.toLocaleString() + '/yr</td></tr>';

        document.getElementById('result').style.display = 'block';
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }

    // Build cross-links
    const allStates = ${JSON.stringify(
      [
        ...['california','florida','georgia','illinois','michigan','new-jersey','new-york','ohio','pennsylvania','texas'],
        ...states.map(st => st.slug)
      ].sort()
    )};
    const linksEl = document.getElementById('state-links');
    allStates.forEach(st => {
        const a = document.createElement('a');
        a.href = '/healthcalcs/auto/' + st + '-auto-insurance.html';
        a.textContent = st.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
        linksEl.appendChild(a);
    });
    </script>
</body>
</html>`;

// Generate all pages
const autoDir = path.join(__dirname, 'auto');
states.forEach(s => {
    const file = path.join(autoDir, `${s.slug}-auto-insurance.html`);
    fs.writeFileSync(file, template(s));
    console.log(`Generated: ${s.slug}-auto-insurance.html`);
});

console.log(`\nTotal new pages: ${states.length}`);
