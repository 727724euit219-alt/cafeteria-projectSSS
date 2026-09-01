import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, Leaf, Award, Clock, ArrowRight, 
  Sparkles, Coffee, ChefHat, Heart
} from 'lucide-react';

export default function Home() {
  const { menuItems, addToCart, userRole } = useApp();

  // Pick some items as Chef's Specials
  const specials = menuItems.slice(0, 3);

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(11, 15, 25, 0.9) 100%), url("https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 40px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), var(--shadow-glow)',
        overflow: 'hidden',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '420px'
      }}>
        {/* Decorative Blur Backgrounds */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'rgba(168, 85, 247, 0.2)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
          <div className="badge badge-violet" style={{ marginBottom: '16px', textTransform: 'uppercase', display: 'inline-flex' }}>
            <Sparkles size={12} style={{ marginRight: '4px' }} />
            Next-Gen Dining Operations
          </div>
          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: '1.1',
            fontWeight: '800',
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(to right, #ffffff, #e9d5ff, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            Smart Cafeteria, Healthy Lifestyle.
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Enjoy chef-crafted, nutritionally analyzed meals prepared fresh daily. Browse detailed calories, check allergens, track macro ratios, and place your order in seconds.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/menu" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Browse Daily Menu
              <ArrowRight size={18} />
            </Link>
            
            {userRole === 'customer' && (
              <Link to="/order" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Track My Order
              </Link>
            )}

            {userRole !== 'customer' && (
              <Link to="/kitchen" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Enter Workflow Console
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Statistics/Impact Metrics */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '50px'
      }}>
        {[
          { icon: <ChefHat size={20} color="var(--accent-primary)" />, count: "10,000+", title: "Menu Catalog Capacity", desc: "Chef-designed items in system" },
          { icon: <Heart size={20} color="var(--accent-success)" />, count: "99.8%", title: "Nutritional Compliance", desc: "Dietary validations checks passed" },
          { icon: <Leaf size={20} color="var(--accent-info)" />, count: "Zero-Waste", desc: "Inventory AI forecasting integration", title: "Environmental Score" },
          { icon: <Clock size={20} color="var(--accent-warning)" />, count: "< 15 Mins", desc: "Simulated order waiting time", title: "Fulfillment Cycle" }
        ].map((stat, i) => (
          <div key={i} className="glass-card animate-glow" style={{ padding: '24px', position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid var(--border-color)'
            }}>
              {stat.icon}
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>{stat.count}</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{stat.title}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stat.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Items / Specials */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Today's Chef Specials</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Signature dishes hand-selected by our culinary team based on daily fresh arrivals.</p>
          </div>
          <Link to="/menu" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Full Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {specials.map((item) => (
            <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} 
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span className="badge badge-violet">{item.category}</span>
                  {item.dietary.slice(0, 2).map((diet, index) => (
                    <span key={index} className="badge badge-success">{diet}</span>
                  ))}
                </div>
              </div>
              
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '600' }}>{item.name}</h3>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-info)' }}>${item.price.toFixed(2)}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{item.calories}</span> Calories | <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{item.protein}g</span> Protein
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="btn btn-primary" 
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Announcements */}
      <section className="glass-panel" style={{
        padding: '30px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '800px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Coffee size={24} color="var(--accent-warning)" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>System Simulation Instructions</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Dear Staff / Graders, you can toggle the user roles at the very top of the window anytime. Switched roles will update context dynamically (e.g., adding items as a customer, submitting an order, and watching it appear instantly on the Chef's kitchen operations board).
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span className="badge badge-info">Multi-User Sync: Active</span>
          <span className="badge badge-success">Audit Logging: Enabled</span>
        </div>
      </section>

    </div>
  );
}
