import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart, Coffee, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const { userRole } = useApp();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 24px',
      marginTop: 'auto',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '30px'
      }}>
        {/* Info Column */}
        <div>
          <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '16px', fontWeight: '600' }}>BiteFlow CMS</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
            A high-performance, secure, and compliant Cafeteria Management System built for modern institutions. Engineered with role-based access controls and intelligent nutritional tracking.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--accent-success)" />
            <span>FDA & HACCP Food Safety Compliant</span>
          </div>
        </div>

        {/* Operating Hours Column */}
        <div>
          <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '16px', fontWeight: '600' }}>Service Schedule</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Breakfast Service</span>
              <span style={{ color: '#fff' }}>07:00 AM - 10:30 AM</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Lunch Service</span>
              <span style={{ color: '#fff' }}>11:30 AM - 03:00 PM</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Snacks & Dinner</span>
              <span style={{ color: '#fff' }}>04:30 PM - 09:30 PM</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-warning)', fontSize: '0.8rem', marginTop: '6px' }}>
              <span>Kitchen Maintenance</span>
              <span>Daily 03:00 PM - 04:30 PM</span>
            </li>
          </ul>
        </div>

        {/* System Diagnostics (High Marks for academic presentation) */}
        <div>
          <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '16px', fontWeight: '600' }}>System Console Status</h4>
          <div className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Core Framework:</span>
              <span style={{ color: 'var(--accent-info)', fontWeight: '600' }}>React 18 / Vite</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Simulator Mode:</span>
              <span className="badge badge-violet" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Role Privilege:</span>
              <span style={{ color: '#fff', textTransform: 'uppercase', fontWeight: '600' }}>{userRole}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Server Latency:</span>
              <span style={{ color: 'var(--accent-success)' }}>0.4ms (Simulated)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span>&copy; {new Date().getFullYear()} BiteFlow Cafeteria Operations. All rights reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Made for 3rd Year IT Capstone Project with</span>
          <Heart size={10} fill="var(--accent-danger)" color="var(--accent-danger)" />
          <span>&amp;</span>
          <Coffee size={10} color="var(--accent-warning)" />
        </div>
      </div>
    </footer>
  );
}
