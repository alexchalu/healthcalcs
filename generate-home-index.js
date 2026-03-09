const fs = require('fs');
const path = require('path');

// All 50 states for the index
const states = [
  { abbr: 'AL', name: 'Alabama', slug: 'alabama', avgPremium: 2400, avgHome: 210000 },
  { abbr: 'AK', name: 'Alaska', slug: 'alaska', avgPremium: 1210, avgHome: 320000 },
  { abbr: 'AZ', name: 'Arizona', slug: 'arizona', avgPremium: 1820, avgHome: 380000 },
  { abbr: 'AR', name: 'Arkansas', slug: 'arkansas', avgPremium: 2680, avgHome: 185000 },
  { abbr: 'CA', name: 'California', slug: 'california', avgPremium: 1680, avgHome: 790000 },
  { abbr: 'CO', name: 'Colorado', slug: 'colorado', avgPremium: 2890, avgHome: 540000 },
  { abbr: 'CT', name: 'Connecticut', slug: 'connecticut', avgPremium: 1720, avgHome: 380000 },
  { abbr: 'DE', name: 'Delaware', slug: 'delaware', avgPremium: 1180, avgHome: 330000 },
  { abbr: 'FL', name: 'Florida', slug: 'florida', avgPremium: 4230, avgHome: 410000 },
  { abbr: 'GA', name: 'Georgia', slug: 'georgia', avgPremium: 2150, avgHome: 320000 },
  { abbr: 'HI', name: 'Hawaii', slug: 'hawaii', avgPremium: 1380, avgHome: 850000 },
  { abbr: 'ID', name: 'Idaho', slug: 'idaho', avgPremium: 1150, avgHome: 420000 },
  { abbr: 'IL', name: 'Illinois', slug: 'illinois', avgPremium: 1820, avgHome: 260000 },
  { abbr: 'IN', name: 'Indiana', slug: 'indiana', avgPremium: 1580, avgHome: 210000 },
  { abbr: 'IA', name: 'Iowa', slug: 'iowa', avgPremium: 1820, avgHome: 195000 },
  { abbr: 'KS', name: 'Kansas', slug: 'kansas', avgPremium: 2980, avgHome: 210000 },
  { abbr: 'KY', name: 'Kentucky', slug: 'kentucky', avgPremium: 1960, avgHome: 195000 },
  { abbr: 'LA', name: 'Louisiana', slug: 'louisiana', avgPremium: 3400, avgHome: 220000 },
  { abbr: 'ME', name: 'Maine', slug: 'maine', avgPremium: 1120, avgHome: 310000 },
  { abbr: 'MD', name: 'Maryland', slug: 'maryland', avgPremium: 1520, avgHome: 380000 },
  { abbr: 'MA', name: 'Massachusetts', slug: 'massachusetts', avgPremium: 1680, avgHome: 560000 },
  { abbr: 'MI', name: 'Michigan', slug: 'michigan', avgPremium: 1580, avgHome: 230000 },
  { abbr: 'MN', name: 'Minnesota', slug: 'minnesota', avgPremium: 1920, avgHome: 320000 },
  { abbr: 'MS', name: 'Mississippi', slug: 'mississippi', avgPremium: 2650, avgHome: 165000 },
  { abbr: 'MO', name: 'Missouri', slug: 'missouri', avgPremium: 2190, avgHome: 220000 },
  { abbr: 'MT', name: 'Montana', slug: 'montana', avgPremium: 1940, avgHome: 380000 },
  { abbr: 'NE', name: 'Nebraska', slug: 'nebraska', avgPremium: 2850, avgHome: 230000 },
  { abbr: 'NV', name: 'Nevada', slug: 'nevada', avgPremium: 1280, avgHome: 420000 },
  { abbr: 'NH', name: 'New Hampshire', slug: 'new-hampshire', avgPremium: 1050, avgHome: 380000 },
  { abbr: 'NJ', name: 'New Jersey', slug: 'new-jersey', avgPremium: 1280, avgHome: 430000 },
  { abbr: 'NM', name: 'New Mexico', slug: 'new-mexico', avgPremium: 1680, avgHome: 280000 },
  { abbr: 'NY', name: 'New York', slug: 'new-york', avgPremium: 1740, avgHome: 440000 },
  { abbr: 'NC', name: 'North Carolina', slug: 'north-carolina', avgPremium: 1920, avgHome: 300000 },
  { abbr: 'ND', name: 'North Dakota', slug: 'north-dakota', avgPremium: 2180, avgHome: 240000 },
  { abbr: 'OH', name: 'Ohio', slug: 'ohio', avgPremium: 1290, avgHome: 210000 },
  { abbr: 'OK', name: 'Oklahoma', slug: 'oklahoma', avgPremium: 3920, avgHome: 195000 },
  { abbr: 'OR', name: 'Oregon', slug: 'oregon', avgPremium: 1190, avgHome: 470000 },
  { abbr: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', avgPremium: 1360, avgHome: 270000 },
  { abbr: 'RI', name: 'Rhode Island', slug: 'rhode-island', avgPremium: 1620, avgHome: 410000 },
  { abbr: 'SC', name: 'South Carolina', slug: 'south-carolina', avgPremium: 2100, avgHome: 260000 },
  { abbr: 'SD', name: 'South Dakota', slug: 'south-dakota', avgPremium: 2350, avgHome: 260000 },
  { abbr: 'TN', name: 'Tennessee', slug: 'tennessee', avgPremium: 2280, avgHome: 280000 },
  { abbr: 'TX', name: 'Texas', slug: 'texas', avgPremium: 3340, avgHome: 310000 },
  { abbr: 'UT', name: 'Utah', slug: 'utah', avgPremium: 1080, avgHome: 480000 },
  { abbr: 'VT', name: 'Vermont', slug: 'vermont', avgPremium: 1050, avgHome: 320000 },
  { abbr: 'VA', name: 'Virginia', slug: 'virginia', avgPremium: 1450, avgHome: 370000 },
  { abbr: 'WA', name: 'Washington', slug: 'washington', avgPremium: 1320, avgHome: 560000 },
  { abbr: 'WV', name: 'West Virginia', slug: 'west-virginia', avgPremium: 1380, avgHome: 150000 },
  { abbr: 'WI', name: 'Wisconsin', slug: 'wisconsin', avgPremium: 1340, avgHome: 260000 },
  { abbr: 'WY', name: 'Wyoming', slug: 'wyoming', avgPremium: 1620, avgHome: 310000 },
];

const sorted = states.sort((a, b) => a.name.localeCompare(b.name));
const avgNational = Math.round(states.reduce((s, st) => s + st.avgPremium, 0) / states.length);
const most = [...states].sort((a, b) => b.avgPremium - a.avgPremium).slice(0, 5);
const least = [...states].sort((a, b) => a.avgPremium - b.avgPremium).slice(0, 5);

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homeowners Insurance Calculator by State 2026 - All 50 States</title>
    <meta name="description" content="Compare homeowners insurance costs in all 50 states. Free calculators with average premiums, coverage options, and money-saving tips for 2026.">
    <meta name="keywords" content="homeowners insurance calculator, home insurance by state, home insurance cost 2026, cheapest home insurance states, most expensive home insurance">
    <link rel="canonical" href="https://alexchalu.github.io/healthcalcs/home/">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #2c3e50; line-height: 1.6; }
      .container { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; }
      h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #1a237e; }
      h2 { color: #283593; margin: 1.5rem 0 0.75rem; }
      p { margin-bottom: 1rem; }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
      .stat-card { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .stat-card .value { font-size: 1.8rem; font-weight: bold; color: #1a237e; }
      .state-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
      .state-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; }
      .state-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
      .state-card h3 { color: #1a237e; margin-bottom: 0.5rem; font-size: 1.1rem; }
      .state-card .premium { font-size: 1.4rem; font-weight: bold; color: #e74c3c; }
      .state-card .details { color: #7f8c8d; font-size: 0.85rem; margin-top: 0.5rem; }
      .state-card a { display: inline-block; margin-top: 0.75rem; color: #1a237e; font-weight: 600; text-decoration: none; }
      .state-card a:hover { text-decoration: underline; }
      .ranking-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
      .ranking-table th, .ranking-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
      .ranking-table th { background: #f8f9fa; font-weight: 600; }
      .ad-container { margin: 2rem 0; text-align: center; min-height: 90px; }
      .nav-links { margin: 2rem 0; padding: 1.5rem; background: white; border-radius: 8px; }
      .nav-links a { color: #1a237e; text-decoration: none; margin-right: 1rem; }
      footer { text-align: center; padding: 2rem; color: #7f8c8d; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏠 Homeowners Insurance Calculator by State — All 50 States</h1>
        <p>Compare homeowners insurance costs across all 50 U.S. states. Select your state to calculate personalized home insurance estimates based on property value, coverage level, and risk factors.</p>

        <div class="stat-grid">
            <div class="stat-card">
                <div class="value">$${avgNational.toLocaleString()}</div>
                <div>National Avg. Premium</div>
            </div>
            <div class="stat-card">
                <div class="value">$${Math.round(avgNational/12)}</div>
                <div>National Avg. Monthly</div>
            </div>
            <div class="stat-card">
                <div class="value">50</div>
                <div>States Covered</div>
            </div>
        </div>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <h2>Most Expensive States for Home Insurance</h2>
        <table class="ranking-table">
            <tr><th>#</th><th>State</th><th>Avg. Annual Premium</th><th>Monthly</th></tr>
${most.map((s, i) => `            <tr><td>${i+1}</td><td><a href="${s.slug}-home-insurance.html">${s.name}</a></td><td><strong>$${s.avgPremium.toLocaleString()}</strong></td><td>$${Math.round(s.avgPremium/12)}</td></tr>`).join('\n')}
        </table>

        <h2>Cheapest States for Home Insurance</h2>
        <table class="ranking-table">
            <tr><th>#</th><th>State</th><th>Avg. Annual Premium</th><th>Monthly</th></tr>
${least.map((s, i) => `            <tr><td>${i+1}</td><td><a href="${s.slug}-home-insurance.html">${s.name}</a></td><td><strong>$${s.avgPremium.toLocaleString()}</strong></td><td>$${Math.round(s.avgPremium/12)}</td></tr>`).join('\n')}
        </table>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="2345678901" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <h2>All 50 States</h2>
        <div class="state-grid">
${sorted.map(s => `            <div class="state-card">
                <h3>🏠 ${s.name}</h3>
                <div class="premium">$${s.avgPremium.toLocaleString()}/year</div>
                <div class="details">Avg. home: $${s.avgHome.toLocaleString()} | Monthly: $${Math.round(s.avgPremium/12)}</div>
                <a href="${s.slug}-home-insurance.html">Calculate ${s.abbr} Rate →</a>
            </div>`).join('\n')}
        </div>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="9876543210" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="nav-links">
            <strong>More Calculators:</strong><br>
            <a href="/healthcalcs/">← All Health Calculators</a>
            <a href="/healthcalcs/auto/">Auto Insurance by State</a>
            <a href="/healthcalcs/life-insurance-calculator.html">Life Insurance</a>
            <a href="/healthcalcs/health-insurance-cost.html">Health Insurance</a>
        </div>

        <footer>
            <p>© 2026 HealthCalcs. For informational purposes only. Get quotes from licensed insurers for accurate pricing.</p>
        </footer>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'home', 'index.html'), indexHtml);
console.log('Generated home/index.html with all 50 states');
