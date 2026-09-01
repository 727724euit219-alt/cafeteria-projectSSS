import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Access Control Simulator State
  const [userRole, setUserRole] = useState('customer'); // Default role
  const [currentUser, setCurrentUser] = useState({
    id: 1, 
    name: "Sanjai",
    email: "sanjai.it.3rd@edu.in",
    employeeId: "ST-88123",
    dietaryRestrictions: ["Low-Sodium", "Gluten-Free"],
    caloriesTarget: 2200,
    role: "CUSTOMER"
  });
  const [token, setToken] = useState(null);

  // Core App states
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to BiteFlow! Connected to live backend.", type: "INFO", isRead: false, timestamp: new Date().toISOString() }
  ]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Login as default user on mount
  useEffect(() => {
    const loginDefault = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Sanjai', password: 'password123' })
        });
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Auto login failed", err);
      }
    };
    loginDefault();
  }, []);

  // Fetch data when token is available
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const menuRes = await fetch('http://localhost:3000/api/menu');
        const menuData = await menuRes.json();
        const formattedMenu = Array.isArray(menuData) ? menuData.map(item => ({
          ...item,
          image: item.image_url,
          allergens: item.allergens ? item.allergens.split(', ') : [],
          dietary: [], 
          protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 
        })) : [];
        setMenuItems(formattedMenu);

        const ordersRes = await fetch('http://localhost:3000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        const formattedOrders = Array.isArray(ordersData) ? ordersData.map(o => ({
          ...o,
          customerId: o.customer_id,
          customerName: o.customer?.username || 'Unknown',
          orderDate: o.order_date,
          totalAmount: o.total_amount,
          paymentMethod: o.payment_method,
          deliveryPreference: o.delivery_preference,
          specialInstructions: o.special_instructions,
          estimatedReadyTime: o.estimated_ready_time,
          items: o.order_items.map(item => ({
            id: item.menu_item_id,
            name: item.menu_item?.name,
            price: item.unit_price,
            quantity: item.quantity
          }))
        })) : [];
        setOrders(formattedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (error) {
        console.error("Failed to fetch data from backend", error);
      }
    };
    fetchData();
  }, [token]);

  // Sync current user profile values when simulated role changes
  const switchRole = (newRole) => {
    setUserRole(newRole);
    let mockProfile = {};
    switch (newRole) {
      case 'customer':
        mockProfile = { id: 1, name: "Sanjai", email: "sanjai.it.3rd@edu.in", employeeId: "ST-88123", dietaryRestrictions: ["Low-Sodium", "Gluten-Free"], caloriesTarget: 2200, role: "CUSTOMER" };
        break;
      case 'chef':
        mockProfile = { id: 1, name: "Head Chef Marco", email: "marco.kitchen@biteflow.com", employeeId: "CF-309", dietaryRestrictions: [], role: "CHEF" };
        break;
      case 'cashier':
        mockProfile = { id: 1, name: "Sarah Jennings", email: "sarah.pos@biteflow.com", employeeId: "CS-401", dietaryRestrictions: [], role: "CASHIER" };
        break;
      case 'nutritionist':
        mockProfile = { id: 1, name: "Dr. Evelyn Vance", email: "evelyn.rd@biteflow.com", employeeId: "NT-112", dietaryRestrictions: [], role: "NUTRITIONIST" };
        break;
      case 'manager':
        mockProfile = { id: 1, name: "Director Henderson", email: "henderson.ops@biteflow.com", employeeId: "MG-001", dietaryRestrictions: [], role: "CAFETERIA_MANAGER" };
        break;
      case 'admin':
        mockProfile = { id: 1, name: "IT SysAdmin", email: "admin@biteflow.com", employeeId: "AD-999", dietaryRestrictions: [], role: "ADMIN" };
        break;
      default:
        mockProfile = { id: 1, name: "Guest User", email: "", employeeId: "", dietaryRestrictions: [], role: "GUEST" };
    }
    setCurrentUser(mockProfile);
    addAuditLog("ROLE_SWITCHED", "USER", mockProfile.id, userRole.toUpperCase(), newRole.toUpperCase());
    addNotification(`Switched interface view to: ${newRole.toUpperCase()} Dashboard`, "INFO");
  };

  // Helper to add audit logs dynamically
  const addAuditLog = (action, entityType, entityId, oldValue = "", newValue = "") => {
    const newLog = {
      id: Date.now() + Math.random(),
      userId: currentUser.name,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper to add notifications
  const addNotification = (message, type = "INFO") => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Shopping Cart logic
  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    addNotification(`Added ${item.name} to order.`, "SUCCESS");
  };

  const removeFromCart = (itemId) => {
    const item = cart.find(c => c.id === itemId);
    setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== itemId));
    if (item) {
      addNotification(`Removed ${item.name} from order.`, "WARNING");
    }
  };

  const updateCartQuantity = (itemId, qty) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart => prevCart.map(cartItem => 
      cartItem.id === itemId 
        ? { ...cartItem, quantity: qty }
        : cartItem
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Submission Logic
  const placeOrder = async (specialInstructions, paymentMethod, deliveryPreference) => {
    if (cart.length === 0) return null;

    const orderPayload = {
      customer_id: currentUser.id,
      payment_method: paymentMethod,
      special_instructions: specialInstructions,
      delivery_preference: deliveryPreference,
      order_items: cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))
    };

    try {
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      const newOrder = await res.json();
      
      const formattedOrder = {
        ...newOrder,
        customerName: currentUser.name,
        orderDate: newOrder.order_date,
        totalAmount: newOrder.total_amount,
        items: cart,
        status: newOrder.status,
        station: cart[0]?.category === "Entrees" ? "Grill Station" : "Cold Prep"
      };
      
      setOrders(prev => [formattedOrder, ...prev]);
      clearCart();
      addAuditLog("PLACE_ORDER", "ORDER", newOrder.id.toString(), "", `Total: $${formattedOrder.totalAmount}`);
      addNotification(`Order #${newOrder.id} submitted successfully to kitchen.`, "SUCCESS");
      return formattedOrder;
    } catch (error) {
      console.error("Error placing order", error);
      addNotification("Error placing order", "ERROR");
    }
  };

  // Kitchen dashboard operations logic
  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
          addAuditLog("UPDATE_ORDER_STATUS", "ORDER", orderId.toString(), order.status, nextStatus);
          if (nextStatus === "Ready") {
            addNotification(`Order #${orderId} is READY for pick-up!`, "SUCCESS");
          } else if (nextStatus === "Completed") {
            addNotification(`Order #${orderId} has been picked up.`, "INFO");
          }
          return { ...order, status: nextStatus };
        }
        return order;
      }));
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  // Menu Catalog Manager
  const addMenuItem = async (item) => {
    try {
      const payload = {
        name: item.name,
        category: item.category,
        description: item.description,
        price: Number(item.price),
        calories: Number(item.calories),
        allergens: item.allergens?.join(", "),
        chef_id: currentUser.id,
        image_url: item.image
      };
      const res = await fetch('http://localhost:3000/api/menu', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const newItem = await res.json();
      setMenuItems(prev => [...prev, { ...newItem, image: newItem.image_url }]);
      addAuditLog("CREATE_MENU_ITEM", "MENU", newItem.id.toString(), "", newItem.name);
      addNotification(`Menu item "${newItem.name}" added to catalog.`, "SUCCESS");
    } catch (error) {
      console.error("Error adding menu item", error);
    }
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === updatedItem.id) {
        addAuditLog("UPDATE_MENU_ITEM", "MENU", updatedItem.id.toString(), item.name, updatedItem.name);
        return updatedItem;
      }
      return item;
    }));
    addNotification(`Menu item "${updatedItem.name}" updated.`, "SUCCESS");
  };

  const deleteMenuItem = (itemId) => {
    const item = menuItems.find(m => m.id === itemId);
    if (item) {
      setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, status: "INACTIVE" } : m));
      addAuditLog("DELETE_MENU_ITEM", "MENU", itemId.toString(), "ACTIVE", "INACTIVE");
      addNotification(`Menu item "${item.name}" deactivated from catalog.`, "WARNING");
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <AppContext.Provider value={{
      userRole,
      switchRole,
      currentUser,
      menuItems,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      placeOrder,
      updateOrderStatus,
      notifications,
      markNotificationAsRead,
      auditLogs,
      addAuditLog,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      token
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
