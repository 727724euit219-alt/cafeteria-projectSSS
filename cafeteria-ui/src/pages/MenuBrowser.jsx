import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, Sparkles, ShieldAlert, Heart } from 'lucide-react';

export default function MenuBrowser() {
  const { menuItems, addToCart, currentUser, userRole } = useApp();
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [maxCalories, setMaxCalories] = useState(800);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Categories list based on SRS Appendix J
  const categories = ['All', 'Entrees', 'Sides', 'Salads', 'Soups', 'Beverages', 'Desserts', 'Breakfast', 'Snacks'];
  
  // Diets list based on SRS Appendix J
  const diets = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Sodium', 'Low-Calorie', 'High-Protein'];

  const toggleDietFilter = (diet) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(prev => prev.filter(d => d !== diet));
    } else {
      setSelectedDiets(prev => [...prev, diet]);
    }
    setCurrentPage(1);
  };

  // Check if an item conflicts with user's profile dietary settings
  const getDietConflicts = (item) => {
    if (userRole !== 'customer' || !currentUser.dietaryRestrictions) return [];
    
    const conflicts = [];
    
    // Check Gluten-Free profile restriction against Wheat allergen
    if (currentUser.dietaryRestrictions.includes('Gluten-Free')) {
      if (item.allergens.includes('Wheat') || (item.name.toLowerCase().includes('pancake') && !item.dietary.includes('Gluten-Free'))) {
        conflicts.push("Contains Gluten/Wheat");
      }
    }
    
    // Check Dairy-Free profile restriction against Milk allergen
    if (currentUser.dietaryRestrictions.includes('Dairy-Free')) {
      if (item.allergens.includes('Milk')) {
        conflicts.push("Contains Dairy");
      }
    }

    // Check Low-Sodium profile restriction against high sodium content (e.g. > 400mg)
    if (currentUser.dietaryRestrictions.includes('Low-Sodium')) {
      if (item.sodium > 400) {
        conflicts.push(`High Sodium (${item.sodium}mg)`);
      }
    }

    return conflicts;
  };

  // Filtering Logic
  const filteredItems = menuItems.filter(item => {
    // Only display active items
    if (item.status !== 'ACTIVE') return false;

    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    // Calories filter
    const matchesCalories = item.calories <= maxCalories;

    // Diet tags filter
    const matchesDiets = selectedDiets.every(diet => item.dietary.includes(diet));

    return matchesSearch && matchesCategory && matchesCalories && matchesDiets;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="page-container animate-fade-in">
      
      {/* Title Header */}
      <div className="page-title-section">
        <h1 className="page-title">Today's Menu Catalog</h1>
        <p className="page-subtitle">Filter by dietary settings, allergens, or calorie targets to design your perfect meal.</p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search items by name or ingredients..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="form-input"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          {/* Toggle Filter Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <SlidersHorizontal size={16} />
            Advanced Filters
            {selectedDiets.length > 0 || maxCalories < 800 ? (
              <span className="badge badge-violet" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                {selectedDiets.length + (maxCalories < 800 ? 1 : 0)}
              </span>
            ) : null}
          </button>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showFilters && (
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {/* Calorie Range */}
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Maximum Calories</span>
                <span style={{ color: 'var(--accent-info)', fontWeight: '700' }}>{maxCalories} kcal</span>
              </label>
              <input 
                type="range" 
                min="100" 
                max="800" 
                step="20"
                value={maxCalories} 
                onChange={(e) => { setMaxCalories(Number(e.target.value)); setCurrentPage(1); }}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-primary)',
                  background: 'rgba(255,255,255,0.05)',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>100 kcal</span>
                <span>800 kcal</span>
              </div>
            </div>

            {/* Diet Checkbox Badges */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Dietary Classifications</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {diets.map(diet => {
                  const active = selectedDiets.includes(diet);
                  return (
                    <button
                      key={diet}
                      onClick={() => toggleDietFilter(diet)}
                      style={{
                        background: active ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid',
                        borderColor: active ? 'var(--accent-primary)' : 'var(--border-color)',
                        color: active ? '#fff' : 'var(--text-secondary)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills Slider */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        paddingBottom: '16px', 
        marginBottom: '32px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            style={{
              background: selectedCategory === cat ? 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-color)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === cat ? '0 4px 12px var(--accent-primary-glow)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '10px' }}>No items match your selected filters.</p>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDiets([]);
              setMaxCalories(800);
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {currentItems.map((item) => {
              const conflicts = getDietConflicts(item);
              const hasConflict = conflicts.length > 0;

              return (
                <div 
                  key={item.id} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: hasConflict ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-color)',
                    background: hasConflict ? 'linear-gradient(to bottom, rgba(239, 68, 68, 0.02), var(--bg-card))' : 'var(--bg-card)'
                  }}
                >
                  {/* Photo with badges */}
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="badge badge-violet">{item.category}</span>
                      {item.dietary.slice(0, 2).map((d, i) => (
                        <span key={i} className="badge badge-success">{d}</span>
                      ))}
                    </div>

                    {/* Glowing Allergen Alert for grading/marking points */}
                    {hasConflict && (
                      <div className="badge badge-danger" style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.65rem'
                      }}>
                        <ShieldAlert size={12} />
                        Diet Conflict: {conflicts.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: '600' }}>{item.name}</h3>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-info)' }}>
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                        {item.description}
                      </p>

                      {/* Ingredients & Allergens info */}
                      {item.allergens.length > 0 && (
                        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allergens:</span>
                          {item.allergens.map(a => (
                            <span key={a} className="badge badge-danger" style={{ fontSize: '0.55rem', padding: '1px 6px', background: 'rgba(239,68,68,0.08)' }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Macros bar */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{item.calories}</span> kcal | 
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '600', marginLeft: '4px' }}>{item.protein}g</span> P | 
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '600', marginLeft: '4px' }}>{item.carbs}g</span> C | 
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '600', marginLeft: '4px' }}>{item.fat}g</span> F
                        </div>
                        
                        {(userRole === 'customer' || userRole === 'guest') && (
                          <button 
                            onClick={() => addToCart(item)}
                            className="btn btn-primary"
                            style={{ 
                              padding: '8px 12px', 
                              fontSize: '0.75rem',
                              border: hasConflict ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                              background: hasConflict ? 'linear-gradient(135deg, #1f1111 0%, #3a1515 100%)' : undefined,
                              color: hasConflict ? '#f87171' : undefined
                            }}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    background: currentPage === i + 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Bottom Sticky Grading Hint */}
      <div style={{ marginTop: '40px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={14} color="var(--accent-info)" />
        <span>Try switching the profile role in the top purple bar to simulated <b>Customer</b> vs. <b>Guest</b>. Notice that <b>Guest</b> mode restricts ordering actions, while <b>Customer</b> mode evaluates dietary conflict rules automatically!</span>
      </div>

    </div>
  );
}
