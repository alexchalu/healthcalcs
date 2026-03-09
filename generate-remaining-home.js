const fs = require('fs');
const path = require('path');

// Existing states to skip
const existing = new Set(['alabama','arizona','california','colorado','connecticut','florida','georgia','illinois','indiana','louisiana','maryland','massachusetts','michigan','minnesota','new-jersey','new-york','north-carolina','ohio','oklahoma','pennsylvania','south-carolina','tennessee','texas','virginia','washington']);

const states = [
  { abbr: 'AK', name: 'Alaska', slug: 'alaska', avgPremium: 1210, avgHome: 320000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Earthquakes, extreme cold, wildfires', deductible: 1500 },
  { abbr: 'AR', name: 'Arkansas', slug: 'arkansas', avgPremium: 2680, avgHome: 185000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, severe storms, flooding', deductible: 2000 },
  { abbr: 'DE', name: 'Delaware', slug: 'delaware', avgPremium: 1180, avgHome: 330000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Hurricanes, coastal flooding, nor\'easters', deductible: 1000 },
  { abbr: 'HI', name: 'Hawaii', slug: 'hawaii', avgPremium: 1380, avgHome: 850000, minCoverage: 'Dwelling + Liability + Hurricane', naturalDisasters: 'Hurricanes, volcanic activity, tsunamis', deductible: 2000 },
  { abbr: 'ID', name: 'Idaho', slug: 'idaho', avgPremium: 1150, avgHome: 420000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Wildfires, winter storms, earthquakes', deductible: 1000 },
  { abbr: 'IA', name: 'Iowa', slug: 'iowa', avgPremium: 1820, avgHome: 195000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, hail, severe thunderstorms', deductible: 1500 },
  { abbr: 'KS', name: 'Kansas', slug: 'kansas', avgPremium: 2980, avgHome: 210000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, hail, severe wind', deductible: 2500 },
  { abbr: 'KY', name: 'Kentucky', slug: 'kentucky', avgPremium: 1960, avgHome: 195000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, flooding, severe storms', deductible: 1500 },
  { abbr: 'ME', name: 'Maine', slug: 'maine', avgPremium: 1120, avgHome: 310000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Nor\'easters, winter storms, coastal flooding', deductible: 1000 },
  { abbr: 'MS', name: 'Mississippi', slug: 'mississippi', avgPremium: 2650, avgHome: 165000, minCoverage: 'Dwelling + Liability + Wind', naturalDisasters: 'Hurricanes, tornadoes, flooding', deductible: 2500 },
  { abbr: 'MO', name: 'Missouri', slug: 'missouri', avgPremium: 2190, avgHome: 220000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, severe storms, earthquakes (New Madrid)', deductible: 1500 },
  { abbr: 'MT', name: 'Montana', slug: 'montana', avgPremium: 1940, avgHome: 380000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Wildfires, winter storms, hail', deductible: 1500 },
  { abbr: 'NE', name: 'Nebraska', slug: 'nebraska', avgPremium: 2850, avgHome: 230000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, hail, severe thunderstorms', deductible: 2000 },
  { abbr: 'NV', name: 'Nevada', slug: 'nevada', avgPremium: 1280, avgHome: 420000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Wildfires, extreme heat, flash floods', deductible: 1000 },
  { abbr: 'NH', name: 'New Hampshire', slug: 'new-hampshire', avgPremium: 1050, avgHome: 380000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Winter storms, nor\'easters, flooding', deductible: 1000 },
  { abbr: 'NM', name: 'New Mexico', slug: 'new-mexico', avgPremium: 1680, avgHome: 280000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Wildfires, flash floods, hail', deductible: 1500 },
  { abbr: 'ND', name: 'North Dakota', slug: 'north-dakota', avgPremium: 2180, avgHome: 240000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Severe winter storms, tornadoes, flooding', deductible: 1500 },
  { abbr: 'OR', name: 'Oregon', slug: 'oregon', avgPremium: 1190, avgHome: 470000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Wildfires, earthquakes (separate policy), winter storms', deductible: 1000 },
  { abbr: 'RI', name: 'Rhode Island', slug: 'rhode-island', avgPremium: 1620, avgHome: 410000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Hurricanes, nor\'easters, coastal flooding', deductible: 1500 },
  { abbr: 'SD', name: 'South Dakota', slug: 'south-dakota', avgPremium: 2350, avgHome: 260000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, hail, severe winter storms', deductible: 2000 },
  { abbr: 'UT', name: 'Utah', slug: 'utah', avgPremium: 1080, avgHome: 480000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Wildfires, earthquakes, winter storms', deductible: 1000 },
  { abbr: 'VT', name: 'Vermont', slug: 'vermont', avgPremium: 1050, avgHome: 320000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Winter storms, flooding, nor\'easters', deductible: 1000 },
  { abbr: 'WV', name: 'West Virginia', slug: 'west-virginia', avgPremium: 1380, avgHome: 150000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Flooding, winter storms, landslides', deductible: 1000 },
  { abbr: 'WI', name: 'Wisconsin', slug: 'wisconsin', avgPremium: 1340, avgHome: 260000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Tornadoes, winter storms, hail', deductible: 1000 },
  { abbr: 'WY', name: 'Wyoming', slug: 'wyoming', avgPremium: 1620, avgHome: 310000, minCoverage: 'Dwelling + Liability', naturalDisasters: 'Hail, wind, wildfires, winter storms', deductible: 1500 },
];

const dir = path.join(__dirname, 'home');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let generated = 0;
for (const s of states) {
  if (existing.has(s.slug)) { console.log(`Skipping ${s.slug} (exists)`); continue; }
  const monthly = Math.round(s.avgPremium / 12);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.name} Homeowners Insurance Calculator 2026 - Free Home Insurance Estimate</title>
    <meta name="description" content="Calculate homeowners insurance costs in ${s.name}. Free ${s.abbr} home insurance calculator with coverage options, discounts, and average rates for 2026.">
    <meta name="keywords" content="${s.name} homeowners insurance, ${s.abbr} home insurance calculator, ${s.name} home insurance cost, cheap home insurance ${s.abbr}, ${s.slug} homeowners insurance rates 2026">
    <link rel="canonical" href="https://alexchalu.github.io/healthcalcs/home/${s.slug}-home-insurance.html">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #2c3e50; line-height: 1.6; }
      .container { max-width: 900px; margin: 2rem auto; padding: 0 2rem; }
      h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #1a237e; }
      h2 { color: #283593; margin: 1.5rem 0 0.75rem; }
      h3 { color: #3949ab; margin: 1rem 0 0.5rem; }
      p { margin-bottom: 1rem; }
      .calc-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 2rem 0; }
      .input-group { margin: 1.5rem 0; }
      .input-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #34495e; }
      .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; }
      .input-group input:focus, .input-group select:focus { border-color: #1a237e; outline: none; }
      .calc-button { background: #1a237e; color: white; border: none; padding: 1rem 2rem; border-radius: 6px; font-size: 1.1rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem; transition: background 0.2s; }
      .calc-button:hover { background: #0d1761; }
      .result-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 2rem; margin: 2rem 0; border-radius: 6px; display: none; }
      .result-value { font-size: 2.5rem; font-weight: bold; color: #1b5e20; margin: 1rem 0; }
      .result-sub { font-size: 1.2rem; color: #388e3c; }
      .coverage-table { width: 100%; margin: 1.5rem 0; border-collapse: collapse; }
      .coverage-table th, .coverage-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
      .coverage-table th { background: #f8f9fa; font-weight: 600; }
      .ad-container { margin: 2rem 0; text-align: center; min-height: 90px; }
      .info-box { background: #e3f2fd; border-left: 4px solid #1976d2; padding: 1.5rem; margin: 2rem 0; border-radius: 6px; }
      .warn-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 1.5rem; margin: 2rem 0; border-radius: 6px; }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
      .stat-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; }
      .stat-card .value { font-size: 1.8rem; font-weight: bold; color: #1a237e; }
      .tips-list { list-style: none; padding: 0; }
      .tips-list li { padding: 0.75rem 0 0.75rem 2rem; position: relative; border-bottom: 1px solid #f0f0f0; }
      .tips-list li::before { content: '✅'; position: absolute; left: 0; }
      .nav-links { margin: 2rem 0; padding: 1.5rem; background: white; border-radius: 8px; }
      .nav-links a { color: #1a237e; text-decoration: none; margin-right: 1rem; }
      .nav-links a:hover { text-decoration: underline; }
      footer { text-align: center; padding: 2rem; color: #7f8c8d; font-size: 0.9rem; }
      @media (max-width: 600px) { .container { padding: 0 1rem; } h1 { font-size: 1.5rem; } .result-value { font-size: 2rem; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏠 ${s.name} Homeowners Insurance Calculator</h1>
        <p>Calculate homeowners insurance costs in ${s.name} (${s.abbr}). Get estimated premiums based on home value, coverage level, location, and property details for 2026.</p>

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
                <div class="value">$${monthly}</div>
                <div>Avg. Monthly Payment</div>
            </div>
            <div class="stat-card">
                <div class="value">$${s.avgHome.toLocaleString()}</div>
                <div>Avg. Home Value</div>
            </div>
        </div>

        <div class="calc-card">
            <h2>Calculate Your ${s.abbr} Home Insurance Cost</h2>
            
            <div class="input-group">
                <label>Home Value (Rebuild Cost)</label>
                <input type="number" id="homeValue" value="${s.avgHome}" min="50000" max="5000000" step="10000">
            </div>

            <div class="input-group">
                <label>Coverage Level</label>
                <select id="coverageLevel">
                    <option value="basic">Basic (HO-1) - Named Perils Only</option>
                    <option value="standard" selected>Standard (HO-3) - Open Perils</option>
                    <option value="premium">Premium (HO-5) - Comprehensive</option>
                </select>
            </div>

            <div class="input-group">
                <label>Deductible</label>
                <select id="deductible">
                    <option value="500">$500</option>
                    <option value="1000" ${s.deductible <= 1000 ? 'selected' : ''}>$1,000</option>
                    <option value="1500" ${s.deductible === 1500 ? 'selected' : ''}>$1,500</option>
                    <option value="2000" ${s.deductible === 2000 ? 'selected' : ''}>$2,000</option>
                    <option value="2500" ${s.deductible >= 2500 ? 'selected' : ''}>$2,500</option>
                    <option value="5000">$5,000</option>
                </select>
            </div>

            <div class="input-group">
                <label>Home Age</label>
                <select id="homeAge">
                    <option value="new">New Construction (0-5 years)</option>
                    <option value="moderate" selected>Moderate (6-20 years)</option>
                    <option value="older">Older (21-40 years)</option>
                    <option value="vintage">Vintage (40+ years)</option>
                </select>
            </div>

            <div class="input-group">
                <label>Claim History (past 5 years)</label>
                <select id="claims">
                    <option value="0" selected>No claims</option>
                    <option value="1">1 claim</option>
                    <option value="2">2+ claims</option>
                </select>
            </div>

            <div class="input-group">
                <label>Security Features</label>
                <select id="security">
                    <option value="none">None</option>
                    <option value="basic" selected>Basic (smoke detectors, deadbolts)</option>
                    <option value="monitored">Monitored alarm system</option>
                    <option value="smart">Smart home security + cameras</option>
                </select>
            </div>

            <button class="calc-button" onclick="calculate()">Calculate Home Insurance Cost</button>

            <div class="result-box" id="result">
                <h3>Estimated Annual Premium</h3>
                <div class="result-value" id="annualCost">$0</div>
                <div class="result-sub" id="monthlyCost">$0/month</div>
                
                <table class="coverage-table" style="margin-top:1.5rem">
                    <tr><th>Coverage Component</th><th>Estimated Cost</th></tr>
                    <tr><td>Dwelling Coverage</td><td id="dwellingCost">-</td></tr>
                    <tr><td>Personal Property</td><td id="propertyCost">-</td></tr>
                    <tr><td>Liability Protection</td><td id="liabilityCost">-</td></tr>
                    <tr><td>Additional Living Expenses</td><td id="aleCost">-</td></tr>
                    <tr><th>Total Annual Premium</th><th id="totalCost">-</th></tr>
                </table>
            </div>
        </div>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="9876543210" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calc-card">
            <h2>${s.name} Homeowners Insurance: What You Need to Know</h2>
            
            <div class="info-box">
                <h3>📋 Required Coverage in ${s.name}</h3>
                <p><strong>Minimum:</strong> ${s.minCoverage}. Most mortgage lenders require full replacement cost coverage on the dwelling plus $100,000+ in liability protection.</p>
            </div>

            <div class="warn-box">
                <h3>⚠️ ${s.name} Natural Disaster Risks</h3>
                <p><strong>Key risks:</strong> ${s.naturalDisasters}. Standard homeowners policies may not cover all natural disasters — check if you need supplemental coverage.</p>
            </div>

            <h3>Average ${s.name} Home Insurance Rates by Coverage Level</h3>
            <table class="coverage-table">
                <tr><th>Coverage Level</th><th>Annual Cost</th><th>Monthly Cost</th></tr>
                <tr><td>Basic (HO-1)</td><td>$${Math.round(s.avgPremium * 0.65).toLocaleString()}</td><td>$${Math.round(s.avgPremium * 0.65 / 12)}</td></tr>
                <tr><td>Standard (HO-3)</td><td>$${s.avgPremium.toLocaleString()}</td><td>$${monthly}</td></tr>
                <tr><td>Premium (HO-5)</td><td>$${Math.round(s.avgPremium * 1.45).toLocaleString()}</td><td>$${Math.round(s.avgPremium * 1.45 / 12)}</td></tr>
            </table>

            <h3>Understanding ${s.name} Home Insurance Coverage</h3>
            <p>A standard ${s.name} homeowners insurance policy (HO-3) typically includes:</p>
            <ul class="tips-list">
                <li><strong>Dwelling Coverage:</strong> Pays to repair or rebuild your home if damaged by covered perils</li>
                <li><strong>Other Structures:</strong> Covers detached garages, fences, sheds (typically 10% of dwelling coverage)</li>
                <li><strong>Personal Property:</strong> Replaces belongings damaged or stolen (typically 50-70% of dwelling coverage)</li>
                <li><strong>Liability Protection:</strong> Covers legal costs if someone is injured on your property</li>
                <li><strong>Additional Living Expenses:</strong> Pays for temporary housing if your home is uninhabitable</li>
                <li><strong>Medical Payments:</strong> Covers minor injuries to guests regardless of fault</li>
            </ul>
        </div>

        <div class="calc-card">
            <h2>How to Save on ${s.name} Home Insurance</h2>
            <ul class="tips-list">
                <li><strong>Bundle policies:</strong> Combine home and auto insurance for 10-25% savings</li>
                <li><strong>Increase your deductible:</strong> Going from $1,000 to $2,500 can save 15-25% on premiums</li>
                <li><strong>Install security systems:</strong> Monitored alarms can save 5-15% on premiums</li>
                <li><strong>Improve your credit score:</strong> Better credit = lower premiums in most states</li>
                <li><strong>Claim-free discount:</strong> No claims for 3-5 years can save 10-20%</li>
                <li><strong>New home discount:</strong> Newer homes with modern building codes cost less to insure</li>
                <li><strong>Storm-proof your home:</strong> Impact-resistant roofing and storm shutters reduce risk premiums</li>
                <li><strong>Pay annually:</strong> Avoid monthly installment fees (saves 5-10%)</li>
                <li><strong>Shop around:</strong> Compare at least 3-5 quotes — rates vary significantly between insurers</li>
                <li><strong>Ask about loyalty discounts:</strong> Some insurers reward long-term customers</li>
            </ul>
        </div>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="5678901234" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calc-card">
            <h2>Frequently Asked Questions</h2>
            <h3>How much is homeowners insurance in ${s.name}?</h3>
            <p>The average homeowners insurance premium in ${s.name} is <strong>$${s.avgPremium.toLocaleString()}/year</strong> ($${monthly}/month) for a standard HO-3 policy. Actual costs vary based on home value, location, coverage level, and claims history.</p>

            <h3>What does ${s.name} homeowners insurance cover?</h3>
            <p>A standard policy covers dwelling damage, personal property loss, liability claims, and additional living expenses. It does NOT typically cover floods, earthquakes, or normal wear and tear.</p>

            <h3>Is homeowners insurance required in ${s.name}?</h3>
            <p>While not legally required by ${s.name} state law, mortgage lenders almost always require homeowners insurance as a condition of the loan. If you own your home outright, insurance is optional but strongly recommended.</p>

            <h3>How can I lower my ${s.name} home insurance rates?</h3>
            <p>The most effective strategies are: bundling with auto insurance (10-25% savings), raising your deductible, installing security systems, maintaining a claims-free record, and comparing quotes from multiple insurers annually.</p>
        </div>

        <div class="nav-links">
            <strong>More Insurance Calculators:</strong><br>
            <a href="/healthcalcs/">← All Calculators</a>
            <a href="/healthcalcs/home/">Home Insurance by State</a>
            <a href="/healthcalcs/auto/">Auto Insurance by State</a>
            <a href="/healthcalcs/life-insurance-calculator.html">Life Insurance</a>
            <a href="/healthcalcs/health-insurance-cost.html">Health Insurance</a>
        </div>

        <footer>
            <p>© 2026 HealthCalcs. For informational purposes only. Actual insurance costs may vary. Get quotes from licensed insurers for accurate pricing.</p>
        </footer>
    </div>

    <script>
    function calculate() {
        const homeValue = parseFloat(document.getElementById('homeValue').value);
        const coverage = document.getElementById('coverageLevel').value;
        const deductible = parseFloat(document.getElementById('deductible').value);
        const homeAge = document.getElementById('homeAge').value;
        const claims = parseInt(document.getElementById('claims').value);
        const security = document.getElementById('security').value;

        let baseRate = ${(s.avgPremium / s.avgHome * 100).toFixed(4)} / 100;

        const coverageMultiplier = { basic: 0.65, standard: 1.0, premium: 1.45 };
        baseRate *= coverageMultiplier[coverage];

        const deductibleFactor = { 500: 1.18, 1000: 1.08, 1500: 1.0, 2000: 0.92, 2500: 0.85, 5000: 0.72 };
        baseRate *= deductibleFactor[deductible] || 1.0;

        const ageFactor = { 'new': 0.85, moderate: 1.0, older: 1.18, vintage: 1.35 };
        baseRate *= ageFactor[homeAge];

        const claimsFactor = { 0: 1.0, 1: 1.25, 2: 1.55 };
        baseRate *= claimsFactor[claims];

        const securityFactor = { none: 1.05, basic: 1.0, monitored: 0.90, smart: 0.82 };
        baseRate *= securityFactor[security];

        const annualPremium = Math.round(homeValue * baseRate);
        const monthlyPremium = Math.round(annualPremium / 12);

        const dwelling = Math.round(annualPremium * 0.55);
        const property = Math.round(annualPremium * 0.22);
        const liability = Math.round(annualPremium * 0.13);
        const ale = Math.round(annualPremium * 0.10);

        document.getElementById('annualCost').textContent = '$' + annualPremium.toLocaleString();
        document.getElementById('monthlyCost').textContent = '$' + monthlyPremium.toLocaleString() + '/month';
        document.getElementById('dwellingCost').textContent = '$' + dwelling.toLocaleString() + '/year';
        document.getElementById('propertyCost').textContent = '$' + property.toLocaleString() + '/year';
        document.getElementById('liabilityCost').textContent = '$' + liability.toLocaleString() + '/year';
        document.getElementById('aleCost').textContent = '$' + ale.toLocaleString() + '/year';
        document.getElementById('totalCost').textContent = '$' + annualPremium.toLocaleString() + '/year';

        document.getElementById('result').style.display = 'block';
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }
    </script>
</body>
</html>`;

  const filePath = path.join(dir, `${s.slug}-home-insurance.html`);
  fs.writeFileSync(filePath, html);
  console.log(`Generated: ${s.slug}-home-insurance.html`);
  generated++;
}

console.log(`\\nGenerated ${generated} new home insurance pages`);
console.log(`Total home insurance pages: ${generated + existing.size}`);
