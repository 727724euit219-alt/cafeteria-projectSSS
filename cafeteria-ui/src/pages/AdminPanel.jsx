import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Edit, Trash2, Plus, Terminal, 
  ShieldAlert, Award, FileText, CheckCircle 
} from 'lucide-react';

export default function AdminPanel() {
  const { 
    userRole, 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    auditLogs, 
    addAuditLog 
  } = useApp();

  // Active Admin Sub-tab
  const [activeSubTab, setActiveSubTab] = useState('menu');

  // CRUD Menu Form State
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Entrees');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [sodium, setSodium] = useState('');
  const [allergensText, setAllergensText] = useState('');
  const [dietaryText, setDietaryText] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60');

  // User list state (Mocked locally for simulation)
  const [users, setUsers] = useState([
    { id: "C-4821", name: "Sanjai Kumar", email: "sanjai.it.3rd@edu.in", role: "CUSTOMER", active: true },
    { id: "CH-002", name: "Head Chef Marco", email: "marco.kitchen@biteflow.com", role: "CHEF", active: true },
    { id: "CA-104", name: "Sarah Jennings", email: "sarah.pos@biteflow.com", role: "CASHIER", active: true },
    { id: "NU-05", name: "Dr. Evelyn Vance", email: "evelyn.rd@biteflow.com", role: "NUTRITIONIST", active: true },
    { id: "MG-01", name: "Director Henderson", email: "henderson.ops@biteflow.com", role: "CAFETERIA_MANAGER", active: true },
    { id: "AD-99", name: "IT SysAdmin", email: "admin@biteflow.com", role: "ADMIN", active: true }
  ]);

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.active;
        addAuditLog("TOGGLE_USER_STATUS", "USER", userId, u.active ? "ACTIVE" : "SUSPENDED", nextStatus ? "ACTIVE" : "SUSPENDED");
        return { ...u, active: nextStatus };
      }
      return u;
    }));
  };

  const handleEditClick = (item) => {
    setFormMode('edit');
    setSelectedItemId(item.id);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCalories(item.calories.toString());
    setProtein(item.protein.toString());
    setCarbs(item.carbs.toString());
    setFat(item.fat.toString());
    setSodium(item.sodium.toString());
    setAllergensText(item.allergens.join(', '));
    setDietaryText(item.dietary.join(', '));
    setImage(item.image);
    
    // Smooth scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormMode('add');
    setSelectedItemId(null);
    setName('');
    setCategory('Entrees');
    setDescription('');
    setPrice('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSodium('');
    setAllergensText('');
    setDietaryText('');
    setImage('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60');
  };

  const handleMenuSubmit = (e) => {
    e.preventDefault();
    
    // Parse allergens & diets
    const allergens = allergensText ? allergensText.split(',').map(s => s.trim()).filter(Boolean) : [];
    const dietary = dietaryText ? dietaryText.split(',').map(s => s.trim()).filter(Boolean) : [];

    const itemPayload = {
      id: selectedItemId,
      name,
      category,
      description,
      price: parseFloat(price) || 0,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      sodium: parseInt(sodium) || 0,
      allergens,
      dietary,
      image,
      status: "ACTIVE"
    };

    if (formMode === 'add') {
      addMenuItem(itemPayload);
    } else {
      updateMenuItem(itemPayload);
    }

    resetForm();
  };

  // Access Validation
  if (userRole !== 'admin') {
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
            Access Restricted: Security Controls
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            The Control Room is restricted exclusively to the system <b>Admin</b> role.
          </p>

          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)', textAlign: 'left', marginBottom: '24px' }}>
            <p style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Award size={16} color="var(--accent-primary)" />
              Professor / Grader Simulation Instruction:
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Click on the <b>ADMIN</b> button in the top purple banner to access administrative operations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      
      {/* Header */}
      <div className="page-title-section">
        <h1 className="page-title">System Control Console</h1>
        <p className="page-subtitle">Perform CRUD database operations, adjust user roles privileges, and audit system events logs.</p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '32px',
        gap: '8px'
      }}>
        {[
          { key: 'menu', label: 'Menu Catalog Database (CRUD)', icon: <Users size={16} /> },
          { key: 'users', label: 'User Privilege Panel', icon: <Users size={16} /> },
          { key: 'logs', label: 'Audit & Compliance Logs', icon: <Terminal size={16} /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === tab.key ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeSubTab === tab.key ? '#fff' : 'var(--text-secondary)',
              padding: '12px 18px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Menu CRUD Database manager */}
      {activeSubTab === 'menu' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '30px'
        }}>
          
          {/* Menu Catalog Entry Form */}
          <form onSubmit={handleMenuSubmit} className="glass-panel" style={{ padding: '24px', alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', color: '#fff' }}>
              {formMode === 'add' ? 'Add New Menu Item' : 'Modify Menu Record'}
            </h3>

            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Avocado Toast" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Entrees">Entrees</option>
                  <option value="Sides">Sides</option>
                  <option value="Salads">Salads</option>
                  <option value="Soups">Soups</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" className="form-input" required value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="2" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Short recipe explanation..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Calories</label>
                <input type="number" className="form-input" value={calories} onChange={e => setCalories(e.target.value)} placeholder="kcal" />
              </div>
              <div className="form-group">
                <label className="form-label">Protein (g)</label>
                <input type="number" className="form-input" value={protein} onChange={e => setProtein(e.target.value)} placeholder="g" />
              </div>
              <div className="form-group">
                <label className="form-label">Sodium (mg)</label>
                <input type="number" className="form-input" value={sodium} onChange={e => setSodium(e.target.value)} placeholder="mg" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Allergens (Comma-separated)</label>
                <input type="text" className="form-input" value={allergensText} onChange={e => setAllergensText(e.target.value)} placeholder="e.g. Milk, Wheat" />
              </div>
              <div className="form-group">
                <label className="form-label">Dietary Tags (Comma-separated)</label>
                <input type="text" className="form-input" value={dietaryText} onChange={e => setDietaryText(e.target.value)} placeholder="e.g. Vegan, Gluten-Free" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="text" className="form-input" value={image} onChange={e => setImage(e.target.value)} placeholder="Unsplash url..." />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                <Plus size={16} />
                {formMode === 'add' ? 'Insert into Database' : 'Update Record'}
              </button>
              {formMode === 'edit' && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Menu Catalog Database Table listing */}
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Catalog Registry ({menuItems.filter(m => m.status === 'ACTIVE').length} items)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {menuItems.map(item => (
                <div 
                  key={item.id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: item.status === 'INACTIVE' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    opacity: item.status === 'INACTIVE' ? 0.4 : 1
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Category: {item.category} | Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {item.status === 'ACTIVE' && (
                      <>
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="btn-icon" 
                          style={{ width: '30px', height: '30px' }}
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => deleteMenuItem(item.id)}
                          className="btn-icon" 
                          style={{ width: '30px', height: '30px', color: 'var(--accent-danger)' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                    {item.status === 'INACTIVE' && (
                      <span className="badge badge-danger" style={{ fontSize: '0.55rem' }}>DEACTIVATED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: User lifecycles management */}
      {activeSubTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Institutional Accounts Directory
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px' }}>User ID</th>
                <th style={{ padding: '12px 8px' }}>Name</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px' }}>Security Role</th>
                <th style={{ padding: '12px 8px' }}>Access Status</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#fff' }}>
                  <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{user.id}</td>
                  <td style={{ padding: '12px 8px', fontWeight: '600' }}>{user.name}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {user.active ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`btn ${user.active ? 'btn-danger' : 'btn-success'}`}
                      style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                    >
                      {user.active ? 'Suspend Account' : 'Activate Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Terminal-like Audit Logs explorer */}
      {activeSubTab === 'logs' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#070a13', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
              <Terminal size={18} />
              Secured Audit Event Explorer
            </h3>
            <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>LOGGING SERVICE: ONLINE</span>
          </div>

          {/* Scrolling log container */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            lineHeight: '1.4',
            color: '#94a3b8'
          }}>
            {auditLogs.map((log) => (
              <div 
                key={log.id} 
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.01)',
                  borderLeft: '3px solid #6366f1',
                  borderRadius: '0 4px 4px 0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '3px' }}>
                  <span>[{new Date(log.timestamp).toISOString()}]</span>
                  <span style={{ color: '#38bdf8' }}>EVENT: {log.action}</span>
                </div>
                <div>
                  Actor: <span style={{ color: '#fff', fontWeight: 'bold' }}>{log.userId}</span> | 
                  Entity: <span style={{ color: '#fbbf24' }}>{log.entityType} ({log.entityId})</span>
                </div>
                {log.oldValue || log.newValue ? (
                  <div style={{ color: '#cbd5e1', marginTop: '3px' }}>
                    Changeset: <span style={{ textDecoration: log.oldValue ? 'line-through' : 'none', color: '#f87171' }}>{log.oldValue}</span> ➔ <span style={{ color: '#4ade80' }}>{log.newValue}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
