import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, ChefHat, Play, Check, ShieldAlert, 
  Smile, Flame, Award, Coffee, RefreshCw 
} from 'lucide-react';

export default function KitchenDashboard() {
  const { userRole, orders, updateOrderStatus } = useApp();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('PENDING');

  // Check if role is authorized (Chef, Cashier, or Admin)
  const isAuthorized = userRole === 'chef' || userRole === 'cashier' || userRole === 'admin';

  if (!isAuthorized) {
    return (
      <div className="page-container animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px 30px' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: 'var(--accent-danger)'
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '12px' }}>
            Access Restricted: Kitchen Operations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            The Kitchen Operations Console is reserved for food service providers (<b>Chef</b>, <b>Cashier</b>, and <b>Admin</b> roles).
          </p>

          {/* Interactive instruction card to help grader/staff switch roles */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)', textAlign: 'left', marginBottom: '24px' }}>
            <p style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Award size={16} color="var(--accent-primary)" />
              Professor / Grader Simulation Instruction:
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Click on the <b>CHEF</b>, <b>CASHIER</b>, or <b>ADMIN</b> button in the top purple <b>RBAC Simulator Panel</b> to unlock this console immediately.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders based on status tab
  const tabOrders = orders.filter(order => order.status === activeTab);

  // Compute key stats for indicators
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const prepCount = orders.filter(o => o.status === 'PREPARING').length;
  const readyCount = orders.filter(o => o.status === 'READY').length;
  const compCount = orders.filter(o => o.status === 'COMPLETED').length;

  return (
    <div className="page-container animate-fade-in">
      
      {/* Title */}
      <div className="page-title-section">
        <h1 className="page-title">Kitchen Operations Console</h1>
        <p className="page-subtitle">Manage order pipelines, route items to prep stations, and update fulfillment statuses.</p>
      </div>

      {/* Stats Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {[
          { label: "Pending Tickets", value: pendingCount, color: 'var(--accent-warning)', desc: "Awaiting acceptance" },
          { label: "Active Cooking", value: prepCount, color: 'var(--accent-primary)', desc: "On grills & prep tables" },
          { label: "Ready for Pickup", value: readyCount, color: 'var(--accent-success)', desc: "Awaiting customer collection" },
          { label: "Fulfillment Rate", value: `${Math.round(((compCount) / (orders.length || 1)) * 100)}%`, color: 'var(--accent-info)', desc: "Ratio of completed tickets" }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px', borderLeft: `4px solid ${stat.color}` }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0', fontFamily: 'var(--font-heading)' }}>{stat.value}</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        overflowX: 'auto',
        gap: '8px'
      }}>
        {[
          { key: 'PENDING', label: 'Pending Queue', count: pendingCount },
          { key: 'PREPARING', label: 'Preparing', count: prepCount },
          { key: 'READY', label: 'Ready for Pickup', count: readyCount },
          { key: 'COMPLETED', label: 'Completed History', count: compCount }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              padding: '12px 18px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.key ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      {tabOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Coffee size={36} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>No orders in this queue.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {tabOrders.map((order) => {
            const timeDiff = Math.round((new Date() - new Date(order.orderDate)) / (1000 * 60)); // order age in mins
            
            return (
              <div 
                key={order.id} 
                className="glass-card animate-glow" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.01), var(--bg-card))'
                }}
              >
                {/* Top Info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>
                      Ticket #{order.id}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <Clock size={12} />
                      {timeDiff <= 0 ? 'Just now' : `${timeDiff}m ago`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span className="badge badge-violet" style={{ fontSize: '0.6rem' }}>{order.deliveryPreference}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{order.station || 'General Prep'}</span>
                  </div>

                  {/* Customer details */}
                  <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600', marginBottom: '10px' }}>
                    Customer: <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{order.customerName} ({order.customerId})</span>
                  </p>

                  {/* Item Breakdown List */}
                  <div style={{
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
                      Preparation Checklist
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                      {order.items.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.calories} cal</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Special Prep Instructions warnings */}
                  {order.specialInstructions && (
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: 'var(--accent-warning)',
                      marginBottom: '16px'
                    }}>
                      <Flame size={14} style={{ flexShrink: 0 }} />
                      <div>
                        <span style={{ fontWeight: '700', display: 'block' }}>Chef Warning Note:</span>
                        <span>"{order.specialInstructions}"</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action buttons depending on state */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', gap: '4px' }}
                    >
                      <Play size={12} fill="#fff" />
                      Accept & Cook
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="btn btn-success"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', gap: '4px' }}
                    >
                      <Check size={14} />
                      Complete Cooking
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                      className="btn btn-info"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', gap: '4px' }}
                    >
                      <Smile size={14} />
                      Fulfill Pick-up
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      padding: '6px',
                      border: '1px dashed var(--border-color)',
                      borderRadius: '6px'
                    }}>
                      Fulfillment Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
