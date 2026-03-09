#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const calculators = [
  {
    id: 'home-insurance-cost',
    title: 'Home Insurance Cost Calculator',
    description: 'Estimate your home insurance premium',
    metaDesc: 'Free home insurance cost calculator. Estimate your homeowners insurance premium based on home value, location, deductible, and coverage. Compare rates 2026.',
    category: 'Insurance',
    fields: [
      { id: 'homeValue', label: 'Home Value ($)', type: 'number', placeholder: '300000' },
      { id: 'squareFeet', label: 'Square Feet', type: 'number', placeholder: '2000' },
      { id: 'yearBuilt', label: 'Year Built', type: 'number', placeholder: '2000' },
      { id: 'deductible', label: 'Deductible ($)', type: 'select', options: ['500', '1000', '2500', '5000'] },
      { id: 'coverageAmount', label: 'Coverage Amount ($)', type: 'number', placeholder: '300000' },
    ],
    calculate: `
      const homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
      const squareFeet = parseFloat(document.getElementById('squareFeet').value) || 0;
      const yearBuilt = parseFloat(document.getElementById('yearBuilt').value) || 2000;
      const deductible = parseFloat(document.getElementById('deductible').value) || 1000;
      const coverageAmount = parseFloat(document.getElementById('coverageAmount').value) || homeValue;
      
      if (homeValue === 0) {
        return { error: 'Please enter your home value' };
      }
      
      // Base rate: ~$3.50 per $1000 of coverage (national average)
      let annualPremium = (coverageAmount / 1000) * 3.50;
      
      // Age adjustment
      const age = 2026 - yearBuilt;
      if (age > 30) annualPremium *= 1.2;
      else if (age > 20) annualPremium *= 1.1;
      
      // Deductible adjustment
      if (deductible === 500) annualPremium *= 1.15;
      else if (deductible === 5000) annualPremium *= 0.85;
      
      const monthlyPremium = annualPremium / 12;
      
      return {
        annualPremium: annualPremium.toFixed(2),
        monthlyPremium: monthlyPremium.toFixed(2),
        coveragePerDollar: (annualPremium / coverageAmount * 100).toFixed(3),
        deductible: deductible
      };
    `,
    resultTemplate: `
      <div class="result-card">
        <h3>💰 Estimated Premium</h3>
        <div class="big-number">$\${result.monthlyPremium}/month</div>
        <p class="sub">$\${result.annualPremium}/year</p>
      </div>
      <div class="result-details">
        <div class="detail-row"><span>Coverage Amount:</span><span>$\${result.coverageAmount || coverageAmount}</span></div>
        <div class="detail-row"><span>Deductible:</span><span>$\${result.deductible}</span></div>
        <div class="detail-row"><span>Cost per $100 Coverage:</span><span>$\${result.coveragePerDollar}</span></div>
      </div>
      <div class="info-box">
        <strong>💡 Ways to Lower Your Premium:</strong>
        <ul>
          <li>Increase your deductible to $2,500 or $5,000</li>
          <li>Bundle with auto insurance (save 15-25%)</li>
          <li>Install security system or smoke detectors</li>
          <li>Improve home's roof, plumbing, electrical</li>
          <li>Shop multiple insurers annually</li>
        </ul>
      </div>
    `
  },
  {
    id: 'life-insurance-premium',
    title: 'Life Insurance Premium Calculator',
    description: 'Estimate your life insurance cost',
    metaDesc: 'Free life insurance premium calculator. Estimate term life insurance cost based on age, coverage amount, term length, and health. Compare rates 2026.',
    category: 'Insurance',
    fields: [
      { id: 'age', label: 'Your Age', type: 'number', placeholder: '35' },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
      { id: 'coverageAmount', label: 'Coverage Amount ($)', type: 'number', placeholder: '500000' },
      { id: 'termLength', label: 'Term Length (years)', type: 'select', options: ['10', '15', '20', '25', '30'] },
      { id: 'smoker', label: 'Smoker?', type: 'select', options: ['No', 'Yes'] },
    ],
    calculate: `
      const age = parseFloat(document.getElementById('age').value) || 0;
      const gender = document.getElementById('gender').value;
      const coverageAmount = parseFloat(document.getElementById('coverageAmount').value) || 0;
      const termLength = parseFloat(document.getElementById('termLength').value) || 20;
      const smoker = document.getElementById('smoker').value === 'Yes';
      
      if (age === 0 || coverageAmount === 0) {
        return { error: 'Please enter your age and coverage amount' };
      }
      
      // Base rate per $1000 of coverage
      let baseRate = 0.10; // $0.10 per $1000 for healthy 30yo
      
      // Age adjustment
      if (age < 30) baseRate *= 0.8;
      else if (age < 40) baseRate *= 1.0;
      else if (age < 50) baseRate *= 1.8;
      else if (age < 60) baseRate *= 3.5;
      else baseRate *= 6.0;
      
      // Gender adjustment (women live longer)
      if (gender === 'Female') baseRate *= 0.85;
      
      // Term length adjustment
      if (termLength >= 30) baseRate *= 1.15;
      else if (termLength >= 20) baseRate *= 1.05;
      
      // Smoker adjustment (huge impact)
      if (smoker) baseRate *= 2.5;
      
      const monthlyPremium = (coverageAmount / 1000) * baseRate;
      const annualPremium = monthlyPremium * 12;
      const totalCost = annualPremium * termLength;
      
      return {
        monthlyPremium: monthlyPremium.toFixed(2),
        annualPremium: annualPremium.toFixed(2),
        totalCost: totalCost.toFixed(0),
        termLength: termLength,
        coverageAmount: coverageAmount.toLocaleString()
      };
    `,
    resultTemplate: `
      <div class="result-card">
        <h3>💰 Estimated Premium</h3>
        <div class="big-number">$\${result.monthlyPremium}/month</div>
        <p class="sub">$\${result.annualPremium}/year</p>
      </div>
      <div class="result-details">
        <div class="detail-row"><span>Coverage Amount:</span><span>$\${result.coverageAmount}</span></div>
        <div class="detail-row"><span>Term Length:</span><span>\${result.termLength} years</span></div>
        <div class="detail-row"><span>Total Cost Over Term:</span><span>$\${result.totalCost}</span></div>
      </div>
      <div class="info-box">
        <strong>💡 How Much Coverage Do You Need?</strong>
        <ul>
          <li>Rule of thumb: 10-12x your annual income</li>
          <li>Cover outstanding debts (mortgage, loans)</li>
          <li>Add college costs for children ($100k-200k per child)</li>
          <li>Factor in lost income until retirement</li>
          <li>Term life is 10-15x cheaper than whole life</li>
        </ul>
      </div>
    `
  },
  {
    id: 'health-insurance-cost',
    title: 'Health Insurance Cost Estimator',
    description: 'Estimate your health insurance premium',
    metaDesc: 'Free health insurance cost calculator. Estimate monthly health insurance premium based on age, family size, income, and plan type. ACA marketplace 2026.',
    category: 'Insurance',
    fields: [
      { id: 'age', label: 'Your Age', type: 'number', placeholder: '35' },
      { id: 'familySize', label: 'Family Size', type: 'number', placeholder: '1' },
      { id: 'income', label: 'Annual Income ($)', type: 'number', placeholder: '50000' },
      { id: 'planType', label: 'Plan Type', type: 'select', options: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
      { id: 'smoker', label: 'Smoker?', type: 'select', options: ['No', 'Yes'] },
    ],
    calculate: `
      const age = parseFloat(document.getElementById('age').value) || 0;
      const familySize = parseFloat(document.getElementById('familySize').value) || 1;
      const income = parseFloat(document.getElementById('income').value) || 0;
      const planType = document.getElementById('planType').value;
      const smoker = document.getElementById('smoker').value === 'Yes';
      
      if (age === 0) {
        return { error: 'Please enter your age' };
      }
      
      // Base premium for 21yo
      let basePremium = 350;
      
      // Age adjustment
      if (age < 30) basePremium *= 1.0;
      else if (age < 40) basePremium *= 1.3;
      else if (age < 50) basePremium *= 1.8;
      else if (age < 60) basePremium *= 2.5;
      else basePremium *= 3.0;
      
      // Plan type adjustment
      if (planType === 'Bronze') basePremium *= 0.85;
      else if (planType === 'Silver') basePremium *= 1.0;
      else if (planType === 'Gold') basePremium *= 1.25;
      else if (planType === 'Platinum') basePremium *= 1.5;
      
      // Family size (additional members cost ~40% each)
      basePremium *= (1 + (familySize - 1) * 0.4);
      
      // Smoker surcharge
      if (smoker) basePremium *= 1.5;
      
      // ACA subsidy calculation
      const fpl = 15060 + (5380 * (familySize - 1)); // 2026 FPL estimate
      const fplPercent = (income / fpl * 100).toFixed(0);
      let subsidy = 0;
      let subsidyPercent = 0;
      
      if (income > 0 && income < fpl * 4) {
        // Simplified subsidy (actual is more complex)
        if (fplPercent < 150) subsidyPercent = 85;
        else if (fplPercent < 200) subsidyPercent = 70;
        else if (fplPercent < 250) subsidyPercent = 55;
        else if (fplPercent < 300) subsidyPercent = 35;
        else if (fplPercent < 400) subsidyPercent = 20;
        
        subsidy = basePremium * (subsidyPercent / 100);
      }
      
      const afterSubsidy = basePremium - subsidy;
      const annualCost = afterSubsidy * 12;
      
      return {
        monthlyPremium: basePremium.toFixed(2),
        subsidy: subsidy.toFixed(2),
        afterSubsidy: afterSubsidy.toFixed(2),
        annualCost: annualCost.toFixed(2),
        fplPercent: fplPercent,
        planType: planType
      };
    `,
    resultTemplate: `
      <div class="result-card">
        <h3>💰 Estimated Monthly Premium</h3>
        <div class="big-number">$\${result.monthlyPremium}</div>
        <p class="sub" style="color: #10b981;">After subsidy: $\${result.afterSubsidy}/month</p>
      </div>
      <div class="result-details">
        <div class="detail-row"><span>Plan Type:</span><span>\${result.planType}</span></div>
        <div class="detail-row"><span>Monthly Subsidy:</span><span style="color: #10b981;">-$\${result.subsidy}</span></div>
        <div class="detail-row"><span>Annual Cost:</span><span>$\${result.annualCost}</span></div>
        <div class="detail-row"><span>% of Federal Poverty Level:</span><span>\${result.fplPercent}%</span></div>
      </div>
      <div class="info-box">
        <strong>💡 About ACA Subsidies:</strong>
        <ul>
          <li>Subsidies available if income is 100-400% of FPL</li>
          <li>Apply at HealthCare.gov during open enrollment</li>
          <li>Bronze = lowest premium, highest deductible</li>
          <li>Platinum = highest premium, lowest out-of-pocket</li>
          <li>Silver plans qualify for additional cost-sharing reductions</li>
        </ul>
      </div>
    `
  },
  {
    id: 'disability-insurance',
    title: 'Disability Insurance Calculator',
    description: 'Estimate your disability insurance cost',
    metaDesc: 'Free disability insurance calculator. Estimate monthly premium for long-term and short-term disability coverage based on income, age, occupation.',
    category: 'Insurance',
    fields: [
      { id: 'income', label: 'Annual Income ($)', type: 'number', placeholder: '60000' },
      { id: 'age', label: 'Your Age', type: 'number', placeholder: '35' },
      { id: 'occupation', label: 'Occupation Risk', type: 'select', options: ['Low (office work)', 'Medium (light labor)', 'High (construction, trades)'] },
      { id: 'coveragePercent', label: 'Income Coverage %', type: 'select', options: ['50', '60', '70'] },
      { id: 'eliminationPeriod', label: 'Elimination Period (days)', type: 'select', options: ['30', '60', '90', '180'] },
    ],
    calculate: `
      const income = parseFloat(document.getElementById('income').value) || 0;
      const age = parseFloat(document.getElementById('age').value) || 0;
      const occupation = document.getElementById('occupation').value;
      const coveragePercent = parseFloat(document.getElementById('coveragePercent').value) || 60;
      const eliminationPeriod = parseFloat(document.getElementById('eliminationPeriod').value) || 90;
      
      if (income === 0 || age === 0) {
        return { error: 'Please enter your income and age' };
      }
      
      const monthlyIncome = income / 12;
      const monthlyBenefit = monthlyIncome * (coveragePercent / 100);
      
      // Base rate: 1-3% of monthly benefit
      let baseRate = 0.02;
      
      // Age adjustment
      if (age < 30) baseRate *= 0.9;
      else if (age < 40) baseRate *= 1.0;
      else if (age < 50) baseRate *= 1.3;
      else if (age < 60) baseRate *= 1.7;
      else baseRate *= 2.2;
      
      // Occupation risk
      if (occupation.includes('Low')) baseRate *= 1.0;
      else if (occupation.includes('Medium')) baseRate *= 1.4;
      else if (occupation.includes('High')) baseRate *= 2.0;
      
      // Elimination period (longer wait = lower premium)
      if (eliminationPeriod === 30) baseRate *= 1.3;
      else if (eliminationPeriod === 60) baseRate *= 1.15;
      else if (eliminationPeriod === 90) baseRate *= 1.0;
      else if (eliminationPeriod === 180) baseRate *= 0.8;
      
      const monthlyPremium = monthlyBenefit * baseRate;
      const annualPremium = monthlyPremium * 12;
      const benefitVsPremium = ((monthlyBenefit / monthlyPremium) - 1).toFixed(1);
      
      return {
        monthlyPremium: monthlyPremium.toFixed(2),
        annualPremium: annualPremium.toFixed(2),
        monthlyBenefit: monthlyBenefit.toFixed(2),
        coveragePercent: coveragePercent,
        eliminationPeriod: eliminationPeriod,
        benefitVsPremium: benefitVsPremium
      };
    `,
    resultTemplate: `
      <div class="result-card">
        <h3>💰 Estimated Premium</h3>
        <div class="big-number">$\${result.monthlyPremium}/month</div>
        <p class="sub">$\${result.annualPremium}/year</p>
      </div>
      <div class="result-details">
        <div class="detail-row"><span>Monthly Benefit:</span><span>$\${result.monthlyBenefit}</span></div>
        <div class="detail-row"><span>Coverage Percentage:</span><span>\${result.coveragePercent}%</span></div>
        <div class="detail-row"><span>Elimination Period:</span><span>\${result.eliminationPeriod} days</span></div>
        <div class="detail-row"><span>Benefit vs Premium Ratio:</span><span>\${result.benefitVsPremium}x</span></div>
      </div>
      <div class="info-box">
        <strong>💡 Key Facts About Disability Insurance:</strong>
        <ul>
          <li>Covers 50-70% of income if you're unable to work</li>
          <li>Elimination period = waiting time before benefits start</li>
          <li>Longer elimination = lower premium</li>
          <li>25% of workers will be disabled for 90+ days before age 65</li>
          <li>Employer group coverage often insufficient</li>
        </ul>
      </div>
    `
  }
];

function generateHTML(calc) {
  const fieldHTML = calc.fields.map(f => {
    if (f.type === 'select') {
      return `
        <div class="input-group">
          <label for="${f.id}">${f.label}</label>
          <select id="${f.id}">
            ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
        </div>`;
    } else {
      return `
        <div class="input-group">
          <label for="${f.id}">${f.label}</label>
          <input type="${f.type}" id="${f.id}" placeholder="${f.placeholder || ''}">
        </div>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calc.title} - Free Insurance Calculator 2026 | HealthCalcs</title>
    <meta name="description" content="${calc.metaDesc}">
    <link rel="canonical" href="https://alexchalu.github.io/healthcalcs/${calc.id}.html">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 900px; margin: 0 auto; padding: 0 1rem; }
        .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .main { padding: 2rem 0; }
        .calculator-box { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
        .input-group input, .input-group select { width: 100%; padding: 0.75rem; border: 2px solid #e0e6ed; border-radius: 6px; font-size: 1rem; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #10b981; }
        .btn { background: #10b981; color: white; border: none; padding: 0.75rem 2rem; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; width: 100%; }
        .btn:hover { background: #059669; }
        #result { margin-top: 2rem; }
        .result-card { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1.5rem; border-radius: 10px; text-align: center; margin-bottom: 1rem; }
        .result-card h3 { margin-bottom: 0.5rem; font-size: 1.1rem; }
        .big-number { font-size: 2.5rem; font-weight: 800; margin: 0.5rem 0; }
        .sub { opacity: 0.9; font-size: 1rem; }
        .result-details { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; }
        .detail-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #dcfce7; }
        .detail-row:last-child { border: none; }
        .detail-row span:first-child { color: #666; }
        .detail-row span:last-child { font-weight: 600; color: #059669; }
        .info-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 6px; margin-top: 1rem; }
        .info-box strong { display: block; margin-bottom: 0.5rem; color: #f59e0b; }
        .info-box ul { margin-left: 1.5rem; }
        .info-box li { margin-bottom: 0.5rem; color: #666; }
        .ad-placeholder { background: #f0f0f0; border: 2px dashed #ccc; padding: 2rem; text-align: center; margin: 2rem 0; border-radius: 8px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        .footer { background: #1f2937; color: white; padding: 2rem 0; text-align: center; margin-top: 3rem; }
        .footer a { color: #10b981; text-decoration: none; margin: 0 0.5rem; }
        @media (max-width: 768px) { .header h1 { font-size: 1.5rem; } .big-number { font-size: 2rem; } }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${calc.title}</h1>
            <p>${calc.description}</p>
        </div>
    </div>

    <div class="main container">
        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calculator-box">
            <h2>Calculate Your ${calc.category} Cost</h2>
            ${fieldHTML}
            <button class="btn" onclick="calculate()">Calculate</button>
            <div id="result"></div>
        </div>

        <div class="ad-placeholder">
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="calculator-box">
            <h3>More Insurance & Health Calculators</h3>
            <p>Check out our other tools:</p>
            <ul style="margin: 1rem 0 0 1.5rem;">
                <li><a href="index.html">HealthCalcs Home - All Health & Wellness Tools</a></li>
                <li><a href="https://alexchalu.github.io/smartcalc/">SmartCalc - Financial Calculators</a></li>
                <li><a href="https://alexchalu.github.io/toolpulse/">ToolPulse - 500+ Free Tools</a></li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; 2026 HealthCalcs. Free health, wellness & insurance calculators.</p>
            <p><a href="index.html">Home</a> <a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a> <a href="https://alexchalu.github.io/toolpulse/">ToolPulse</a></p>
            <p style="margin-top: 1rem; font-size: 0.85rem; opacity: 0.8;">Disclaimer: These are estimates only. Actual insurance rates vary by provider, location, and individual circumstances. Consult a licensed insurance agent for accurate quotes.</p>
        </div>
    </div>

    <script>
        function calculate() {
            ${calc.calculate}
            
            const result = (function() {
                ${calc.calculate}
            })();
            
            if (result.error) {
                document.getElementById('result').innerHTML = '<div class="info-box" style="border-color: #ef4444;"><strong style="color: #ef4444;">⚠️ ' + result.error + '</strong></div>';
                return;
            }
            
            document.getElementById('result').innerHTML = \`${calc.resultTemplate}\`;
        }
    </script>
</body>
</html>`;
}

// Generate all calculators
calculators.forEach(calc => {
  const html = generateHTML(calc);
  fs.writeFileSync(path.join(__dirname, `${calc.id}.html`), html);
  console.log(`✓ Generated ${calc.id}.html`);
});

console.log(`\n✅ Generated ${calculators.length} high-CPC insurance calculators`);
console.log('📝 Next: Update sitemap.xml and index.html');
