import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Trash2, CreditCard, Clock, 
  MapPin, CheckCircle, ArrowLeft, Coffee, Sparkles 
} from 'lucide-react';

export default function OrderForm() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    placeOrder, 
    currentUser 
  } = useApp();

  // Form Fields State
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MEAL_PLAN');
  const [deliveryPreference, setDeliveryPreference] = useState('Dine-in');
  
  // Workflow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0825; // 8.25%
  const containerFee = subtotal > 0 ? 1.50 : 0;
  const total = subtotal + tax + containerFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate payment gateway & inventory checking latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const orderResult = await placeOrder(specialInstructions, paymentMethod, deliveryPreference);
    setIsSubmitting(false);
    setSubmittedOrder(orderResult);
  };

  // 1. Success Screen View
  if (submittedOrder) {
    return (
      <div className="page-container animate-fade-in" style={{ maxWidth: '650px' }}>
        <div className="glass-panel" style={{ padding: '40px 30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          {/* Decorative glowing background */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '200px',
            background: 'var(--accent-success-glow)',
            filter: 'blur(60px)',
            borderRadius: '50%',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', width: '64px', height: '64px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <CheckCircle size={36} color="var(--accent-success)" />
            </div>

            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '8px' }}>Order Placed Successfully!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>
              Your order has been transmitted to the kitchen queue.
            </p>

            {/* Digital Receipt Card */}
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '32px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>Order Ticket #{submittedOrder.id}</span>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(submittedOrder.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {submittedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.name}</span>
                    <span style={{ color: '#fff', fontWeight: '500' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Dining Preference:</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{submittedOrder.deliveryPreference}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment Status:</span>
                  <span style={{ color: 'var(--accent-success)', fontWeight: '600' }}>PAID via {submittedOrder.paymentMethod.replace('_', ' ')}</span>
                </div>
                {submittedOrder.specialInstructions && (
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Special Instructions:</span>
                    <span style={{ color: '#fff', fontStyle: 'italic' }}>"{submittedOrder.specialInstructions}"</span>
                  </div>
                )}
              </div>

              {/* Barcode representation */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
                <div style={{
                  background: '#fff',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  display: 'flex',
                  gap: '2px',
                  height: '40px',
                  alignItems: 'stretch',
                  opacity: 0.85
                }}>
                  {/* Mock barcode bars */}
                  {[2,1,3,1,2,4,1,2,3,1,4,2,1,2,3,1,2,4,1,1,3].map((w, i) => (
                    <div key={i} style={{ width: `${w}px`, background: '#000' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>*BITEFLOW-O{submittedOrder.id}*</span>
              </div>
            </div>

            {/* Simulated Action Advice */}
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)', marginBottom: '32px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <p><b>🎓 Academic Project Workflow Tip:</b></p>
              <p style={{ marginTop: '4px' }}>
                Switch your simulated role in the top header menu to <b>CHEF</b> or <b>CASHIER</b> to view this ticket in the active kitchen queue and update its status!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/menu" className="btn btn-secondary">
                Back to Menu
              </Link>
              <Link to="/kitchen" className="btn btn-primary">
                Open Kitchen Console
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart View
  if (cart.length === 0) {
    return (
      <div className="page-container animate-fade-in" style={{ maxWidth: '650px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '60px 40px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: 'var(--text-secondary)'
          }}>
            <ShoppingBag size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '8px' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Browse our menu list to discover healthy, tasty foods loaded with nutrition parameters.
          </p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu Catalog
          </Link>
        </div>
      </div>
    );
  }

  // 3. Checkout Checkout Checkout Form
  return (
    <div className="page-container animate-fade-in">
      <div className="page-title-section">
        <h1 className="page-title">Place Your Order</h1>
        <p className="page-subtitle">Verify details, add kitchen notes, and process your institutional dining order.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '30px'
      }}>
        {/* Left: Cart items checklist */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Selected Items
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '600' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-info)', fontWeight: '600' }}>${item.price.toFixed(2)}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.calories} kcal per unit</p>
                </div>

                {/* Quantity adjuster */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px' }}>
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', width: '20px', height: '20px', fontWeight: 'bold' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '0.85rem', width: '20px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', width: '20px', height: '20px', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>

                {/* Trash delete */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/menu" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Add more items
            </Link>
          </div>
        </div>

        {/* Right: Checkout fields & receipt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Billing / Order Options Form */}
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Fulfillment & Payment
            </h3>

            {/* Dining Preference */}
            <div className="form-group">
              <label className="form-label">Dining Preference</label>
              <select 
                className="form-select"
                value={deliveryPreference}
                onChange={(e) => setDeliveryPreference(e.target.value)}
              >
                <option value="Dine-in">Dine-in (At Cafeteria)</option>
                <option value="Takeaway">Takeaway (Packaged Box)</option>
                <option value="Delivery">Campus Delivery (Office/Dorm)</option>
              </select>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select 
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="MEAL_PLAN">Meal Plan Card Balance</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="DIGITAL_WALLET">UPI / Digital Wallet</option>
                <option value="CASH">Pay at Cashier Counter</option>
              </select>
            </div>

            {/* Special instructions */}
            <div className="form-group">
              <label className="form-label">Special Instructions (Allergens, Prep)</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="e.g. Allergy to walnuts, gluten-free prep required, extra dressing on the side..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Receipt calculation */}
            <div style={{
              background: 'rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Institutional Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Container & Service Fee</span>
                <span>${containerFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--accent-success)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'marquee 1s linear infinite' // simple spin
                  }} />
                  Processing Payment Gateways...
                </div>
              ) : (
                <>
                  Confirm & Place Order (${total.toFixed(2)})
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
