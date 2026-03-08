const fs = require('fs');

const adsenseId = 'ca-pub-3112605892426625';

const states = [
  { name: 'California', abbr: 'CA', avgPremium: 4952, avgDeductible: 2500 },
  { name: 'Texas', abbr: 'TX', avgPremium: 4708, avgDeductible: 2800 },
  { name: 'Florida', abbr: 'FL', avgPremium: 5112, avgDeductible: 3200 },
  { name: 'New York', abbr: 'NY', avgPremium: 5890, avgDeductible: 2200 },
  { name: 'Pennsylvania', abbr: 'PA', avgPremium: 4456, avgDeductible: 2600 },
  { name: 'Illinois', abbr: 'IL', avgPremium: 4623, avgDeductible: 2500 },
  { name: 'Ohio', abbr: 'OH', avgPremium: 4234, avgDeductible: 2700 },
  { name: 'Georgia', abbr: 'GA', avgPremium: 4567, avgDeductible: 2900 },
  { name: 'North Carolina', abbr: 'NC', avgPremium: 4389, avgDeductible: 2800 },
  { name: 'Michigan', abbr: 'MI', avgPremium: 4512, avgDeductible: 2600 },
  { name: 'New Jersey', abbr: 'NJ', avgPremium: 5678, avgDeductible: 2400 },
  { name: 'Virginia', abbr: 'VA', avgPremium: 4423, avgDeductible: 2700 },
  { name: 'Washington', abbr: 'WA', avgPremium: 4789, avgDeductible: 2500 },
  { name: 'Arizona', abbr: 'AZ', avgPremium: 4634, avgDeductible: 2900 },
  { name: 'Massachusetts', abbr: 'MA', avgPremium: 5234, avgDeductible: 2300 }
];

states.forEach(state => {
  const slug = state.name.toLowerCase().replace(/ /g, '-');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.name} Health Insurance Cost Calculator 2026 - Free Estimate</title>
    <meta name="description" content="Calculate health insurance costs in ${state.name}. Free ${state.abbr} health insurance premium estimator with family coverage, deductibles, and subsidies.">
    <meta name="keywords" content="${state.name} health insurance, ${state.abbr} health insurance cost, ${state.name} health insurance calculator, affordable care act ${state.abbr}">
    <link rel="stylesheet" href="/style.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}" crossorigin="anonymous"></script>
    <style>
      .state-calc-container { max-width: 800px; margin: 2rem auto; padding: 0 2rem; }
      .calc-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 2rem 0; }
      .calc-card h2 { color: #2c3e50; margin-top: 0; }
      .input-group { margin: 1.5rem 0; }
      .input-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #34495e; }
      .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; }
      .input-group input:focus, .input-group select:focus { outline: none; border-color: #3498db; }
      .calc-button { background: #3498db; color: white; border: none; padding: 1rem 2rem; border-radius: 6px; font-size: 1.1rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem; }
      .calc-button:hover { background: #2980b9; }
      .result-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 1.5rem; margin: 2rem 0; border-radius: 6px; }
      .result-box h3 { margin-top: 0; color: #2e7d32; }
      .result-value { font-size: 2rem; font-weight: bold; color: #1b5e20; }
      .info-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 1.5rem; margin: 2rem 0; border-radius: 6px; }
      .state-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
      .stat-card { background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center; }
      .stat-card .value { font-size: 1.5rem; font-weight: bold; color: #3498db; }
      .ad-container { margin: 2rem 0; text-align: center; min-height: 90px; }
    </style>
</head>
<body>
    <div class="state-calc-container">
        <h1>💰 ${state.name} Health Insurance Cost Calculator</h1>
        <p>Estimate your health insurance premiums in ${state.name} (${state.abbr}). Calculate monthly costs, annual expenses, and potential subsidies.</p>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="${adsenseId}" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calc-card">
            <h2>Calculate Your ${state.abbr} Health Insurance Cost</h2>
            
            <div class="input-group">
                <label>Your Age</label>
                <input type="number" id="age" value="30" min="18" max="100">
            </div>

            <div class="input-group">
                <label>Number of People Covered</label>
                <select id="familySize">
                    <option value="1">Individual</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                    <option value="5">5+ people</option>
                </select>
            </div>

            <div class="input-group">
                <label>Annual Household Income ($)</label>
                <input type="number" id="income" value="50000" min="0" step="1000">
            </div>

            <div class="input-group">
                <label>Plan Type</label>
                <select id="planType">
                    <option value="bronze">Bronze (lowest premium, highest deductible)</option>
                    <option value="silver" selected>Silver (moderate premium & deductible)</option>
                    <option value="gold">Gold (higher premium, lower deductible)</option>
                    <option value="platinum">Platinum (highest premium, lowest deductible)</option>
                </select>
            </div>

            <button class="calc-button" onclick="calculate()">Calculate Insurance Cost</button>

            <div id="results" style="display:none;">
                <div class="result-box">
                    <h3>Your Estimated ${state.abbr} Health Insurance Cost</h3>
                    <div class="result-value" id="monthlyPremium"></div>
                    <p id="annualPremium"></p>
                    <p id="deductible"></p>
                    <p id="subsidy"></p>
                </div>
            </div>
        </div>

        <div class="state-stats">
            <div class="stat-card">
                <div class="value">$${state.avgPremium.toLocaleString()}</div>
                <div>Avg. ${state.abbr} Premium/Year</div>
            </div>
            <div class="stat-card">
                <div class="value">$${state.avgDeductible.toLocaleString()}</div>
                <div>Avg. Deductible</div>
            </div>
            <div class="stat-card">
                <div class="value">${states.length}</div>
                <div>States Covered</div>
            </div>
        </div>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="${adsenseId}" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="info-box">
            <h3>About ${state.name} Health Insurance</h3>
            <p>Health insurance costs in ${state.name} vary based on age, location, family size, and plan type. The average individual premium in ${state.abbr} is approximately $${Math.round(state.avgPremium/12)}/month or $${state.avgPremium.toLocaleString()}/year.</p>
            <p><strong>Subsidies:</strong> If your income is between 100-400% of the federal poverty level, you may qualify for premium tax credits to reduce your monthly payment.</p>
            <p><strong>Medicaid:</strong> ${state.name} residents with income below 138% of FPL may qualify for Medicaid (free or low-cost coverage).</p>
        </div>

        <h2>How Health Insurance Costs Are Calculated in ${state.abbr}</h2>
        <ul>
            <li><strong>Age:</strong> Older individuals pay higher premiums (up to 3x more than younger people)</li>
            <li><strong>Location:</strong> Costs vary by county and zip code within ${state.name}</li>
            <li><strong>Plan Type:</strong> Bronze plans have lowest premiums but $6000-8000 deductibles; Platinum plans have highest premiums but $0-1000 deductibles</li>
            <li><strong>Family Size:</strong> Each additional family member increases the premium</li>
            <li><strong>Tobacco Use:</strong> Smokers can be charged up to 50% more</li>
        </ul>

        <h2>${state.name} Health Insurance Facts (2026)</h2>
        <ul>
            <li>Average individual premium: $${state.avgPremium.toLocaleString()}/year</li>
            <li>Average deductible: $${state.avgDeductible.toLocaleString()}</li>
            <li>Enrollment period: November 1 - January 15</li>
            <li>Special enrollment: Available after life events (marriage, job loss, move)</li>
        </ul>

        <div class="ad-container">
            <ins class="adsbygoogle" style="display:block" data-ad-client="${adsenseId}" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <h2>Related Health Calculators</h2>
        <ul>
            <li><a href="/health-insurance-cost.html">General Health Insurance Calculator</a></li>
            <li><a href="/bmi.html">BMI Calculator</a></li>
            <li><a href="/calorie.html">Calorie Calculator</a></li>
            <li><a href="/">All Calculators</a></li>
        </ul>

        <p><a href="/">← Back to HealthCalcs</a></p>
    </div>

    <script>
    function calculate() {
        const age = parseInt(document.getElementById('age').value);
        const familySize = parseInt(document.getElementById('familySize').value);
        const income = parseInt(document.getElementById('income').value);
        const planType = document.getElementById('planType').value;

        // Base premium for ${state.abbr}
        let basePremium = ${state.avgPremium};

        // Age factor (increases with age)
        if (age < 30) basePremium *= 0.8;
        else if (age >= 50) basePremium *= 1.3;
        else if (age >= 60) basePremium *= 1.6;

        // Family size multiplier
        basePremium *= (familySize === 1 ? 1 : familySize === 2 ? 2 : familySize * 0.85);

        // Plan type adjustment
        const planMultipliers = { bronze: 0.75, silver: 1, gold: 1.3, platinum: 1.5 };
        basePremium *= planMultipliers[planType];

        // Calculate subsidy (simplified ACA calculation)
        const fpl = 15060 + (familySize - 1) * 5380; // 2026 FPL estimate
        const incomePercent = (income / fpl) * 100;
        let subsidy = 0;
        
        if (incomePercent >= 100 && incomePercent <= 400) {
            const maxPremiumPercent = incomePercent < 150 ? 2 : incomePercent < 200 ? 4 : incomePercent < 250 ? 6 : incomePercent < 300 ? 8 : 10;
            const affordablePremium = income * (maxPremiumPercent / 100);
            subsidy = Math.max(0, basePremium - affordablePremium);
        }

        const finalPremium = Math.max(0, basePremium - subsidy);
        const monthlyPremium = Math.round(finalPremium / 12);
        const annualPremium = Math.round(finalPremium);
        const deductibleAmounts = { bronze: 6500, silver: ${state.avgDeductible}, gold: 1500, platinum: 500 };
        const deductible = deductibleAmounts[planType];

        document.getElementById('monthlyPremium').textContent = '$' + monthlyPremium.toLocaleString() + '/month';
        document.getElementById('annualPremium').textContent = 'Annual cost: $' + annualPremium.toLocaleString();
        document.getElementById('deductible').textContent = 'Deductible: $' + deductible.toLocaleString();
        document.getElementById('subsidy').textContent = subsidy > 0 ? 
            'Estimated subsidy: $' + Math.round(subsidy/12).toLocaleString() + '/month ($' + Math.round(subsidy).toLocaleString() + '/year)' :
            'No subsidy (income too high or too low)';
        
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
    </script>
</body>
</html>`;

  fs.writeFileSync(`state/${slug}-health-insurance.html`, html);
  console.log(`✓ Created state/${slug}-health-insurance.html`);
});

console.log(`\n✅ Generated ${states.length} state-specific health insurance calculators`);
