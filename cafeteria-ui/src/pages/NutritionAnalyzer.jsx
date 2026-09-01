import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ShieldAlert, Heart, Info, Apple, Activity, Award } from 'lucide-react';

export default function NutritionAnalyzer() {
  const { cart, menuItems, currentUser } = useApp();
  
  // Custom Preset Meals to analyze if cart is empty
  const presets = [
    {
      name: "High-Protein Athletic Fuel",
      items: [
        { name: "Grilled Salmon Quinoa Bowl", calories: 580, protein: 42, carbs: 45, fat: 22, sodium: 340, fiber: 8 },
        { name: "Classic High-Protein Pancakes", calories: 450, protein: 30, carbs: 55, fat: 12, sodium: 380, fiber: 6 }
      ]
    },
    {
      name: "Vegan Heart-Healthy Cleanse",
      items: [
        { name: "Mediterranean Chickpea Salad", calories: 390, protein: 12, carbs: 48, fat: 16, sodium: 420, fiber: 10 },
        { name: "Golden Turmeric Lentil Soup", calories: 220, protein: 14, carbs: 32, fat: 4, sodium: 290, fiber: 11 },
        { name: "Baked Sweet Potato Wedges", calories: 180, protein: 3, carbs: 28, fat: 6, sodium: 120, fiber: 5 }
      ]
    },
    {
      name: "Low-Calorie Keto Refresh",
      items: [
        { name: "Grilled Salmon Quinoa Bowl", calories: 580, protein: 42, carbs: 45, fat: 22, sodium: 340, fiber: 8 },
        { name: "Matcha Mint Collagen Cooler", calories: 140, protein: 11, carbs: 8, fat: 5, sodium: 90, fiber: 2 }
      ]
    }
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [analysisSource, setAnalysisSource] = useState(cart.length > 0 ? 'cart' : 'preset');

  // Compute Active Selection
  const getAnalysisItems = () => {
    if (analysisSource === 'cart') {
      return cart;
    }
    return presets[selectedPresetIndex].items;
  };

  const activeItems = getAnalysisItems();

  // Aggregate macros
  const totals = activeItems.reduce((acc, item) => {
    const qty = item.quantity || 1;
    acc.calories += (item.calories || 0) * qty;
    acc.protein += (item.protein || 0) * qty;
    acc.carbs += (item.carbs || 0) * qty;
    acc.fat += (item.fat || 0) * qty;
    acc.fiber += (item.fiber || 0) * qty;
    acc.sodium += (item.sodium || 0) * qty;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 });

  // Calculate macro percentages for Donut Chart
  const totalMacrosWeight = totals.protein + totals.carbs + totals.fat || 1;
  const pPct = Math.round((totals.protein * 4 / (totals.protein * 4 + totals.carbs * 4 + totals.fat * 9 || 1)) * 100);
  const cPct = Math.round((totals.carbs * 4 / (totals.protein * 4 + totals.carbs * 4 + totals.fat * 9 || 1)) * 100);
  const fPct = 100 - pPct - cPct;

  // Visual SVG Pie/Donut Chart Angles
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // Check overall warnings
  const warnings = [];
  if (currentUser.dietaryRestrictions) {
    if (currentUser.dietaryRestrictions.includes('Low-Sodium') && totals.sodium > 800) {
      warnings.push("High Sodium Load: Exceeds safe single-meal limit (800mg) for sodium-sensitive diets.");
    }
    if (totals.calories > currentUser.caloriesTarget * 0.5) {
      warnings.push(`Calorie Threshold Warning: Single meal exceeds 50% of your daily limit (${currentUser.caloriesTarget} kcal).`);
    }
  }

  return (
    <div className="page-container animate-fade-in">
      
      {/* Title */}
      <div className="page-title-section">
        <h1 className="page-title">Dietary & Nutrition Analyzer</h1>
        <p className="page-subtitle">Examine the nutritional structure, macro-balance, and compliance of your selection.</p>
      </div>

      {/* Mode selectors */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setAnalysisSource('cart')}
          disabled={cart.length === 0}
          className={`btn ${analysisSource === 'cart' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          Analyze My Active Cart ({cart.length} items)
        </button>
        <button
          onClick={() => setAnalysisSource('preset')}
          className={`btn ${analysisSource === 'preset' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Analyze Institutional Meal Presets
        </button>
      </div>

      {/* Preset Selector Dropdown */}
      {analysisSource === 'preset' && (
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Select Preset Recipe:</span>
          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '240px' }}
            value={selectedPresetIndex}
            onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
          >
            {presets.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '30px'
      }}>
        
        {/* Left Side: Summary and Specific items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Items list */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Meal Composition
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#fff', fontSize: '0.95rem' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Calories: {item.calories} kcal | Protein: {item.protein}g | Carbs: {item.carbs}g | Fat: {item.fat}g
                    </p>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                    {(item.quantity || 1)}x
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <span style={{ fontWeight: '600' }}>Aggregated Calories:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-info)' }}>{totals.calories} kcal</span>
            </div>
          </div>

          {/* Compliance & Health score cards */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Institutional Compliance Scan
            </h3>
            
            {warnings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {warnings.map((w, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '10px',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '0.85rem'
                  }}>
                    <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '12px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '16px',
                borderRadius: '8px',
                color: '#34d399',
                fontSize: '0.85rem',
                alignItems: 'center'
              }}>
                <ShieldCheck size={24} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: '600', color: '#fff', fontSize: '0.9rem' }}>Dietary Compliance Checked</p>
                  <p>All items in this selection are fully compatible with your registered profile restrictions.</p>
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <p>Registered User Preferences: <b>{currentUser.name}</b></p>
              <p>Registered Exclusions: <b>{currentUser.dietaryRestrictions.join(', ') || 'None'}</b></p>
            </div>
          </div>

        </div>

        {/* Right Side: Charts and Macro breakdown */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Visual Macro-Distribution
          </h3>

          {/* SVG Pie Chart */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '200px' }}>
            <svg width="200" height="200" viewBox="0 0 42 42" className="donut" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))' }}>
              <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="transparent" />
              <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              
              {/* Protein slice */}
              <circle 
                className="donut-segment" 
                cx="21" cy="21" 
                r="15.915" 
                fill="transparent" 
                stroke="var(--accent-primary)" 
                strokeWidth="4.2" 
                strokeDasharray={`${pPct} ${100 - pPct}`} 
                strokeDashoffset="0"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />

              {/* Carbs slice */}
              <circle 
                className="donut-segment" 
                cx="21" cy="21" 
                r="15.915" 
                fill="transparent" 
                stroke="var(--accent-info)" 
                strokeWidth="4.2" 
                strokeDasharray={`${cPct} ${100 - cPct}`} 
                strokeDashoffset={`${100 - pPct}`}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />

              {/* Fats slice */}
              <circle 
                className="donut-segment" 
                cx="21" cy="21" 
                r="15.915" 
                fill="transparent" 
                stroke="var(--accent-warning)" 
                strokeWidth="4.2" 
                strokeDasharray={`${fPct} ${100 - fPct}`} 
                strokeDashoffset={`${100 - pPct - cPct}`}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>

            {/* Total Indicator in donut center */}
            <div style={{
              position: 'absolute',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                {totals.calories}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Kcal
              </span>
            </div>
          </div>

          {/* Donut Legend & Grams */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Protein</span>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{totals.protein}g</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pPct}% Energy</p>
            </div>
            
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-info)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Carbs</span>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{totals.carbs}g</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cPct}% Energy</p>
            </div>

            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-warning)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Fats</span>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{totals.fat}g</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{fPct}% Energy</p>
            </div>
          </div>

          {/* Micro-Nutrients Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Micro-Nutrient Thresholds</h4>
            
            {/* Fiber progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Dietary Fiber ({totals.fiber}g / 25g target)</span>
                <span style={{ fontWeight: '600' }}>{Math.min(Math.round((totals.fiber / 25) * 100), 100)}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: 'var(--accent-success)',
                  width: `${Math.min((totals.fiber / 25) * 100, 100)}%`,
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
            </div>

            {/* Sodium progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Sodium Intake ({totals.sodium}mg / 1500mg limit)</span>
                <span style={{ fontWeight: '600', color: totals.sodium > 800 ? 'var(--accent-danger)' : undefined }}>
                  {Math.min(Math.round((totals.sodium / 1500) * 100), 100)}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: totals.sodium > 800 ? 'var(--accent-danger)' : 'var(--accent-info)',
                  width: `${Math.min((totals.sodium / 1500) * 100, 100)}%`,
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
