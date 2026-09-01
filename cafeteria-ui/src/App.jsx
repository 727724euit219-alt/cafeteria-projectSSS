import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Component Layouts
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import MenuBrowser from './pages/MenuBrowser';
import OrderForm from './pages/OrderForm';
import KitchenDashboard from './pages/KitchenDashboard';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <NavBar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuBrowser />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AppProvider>
  );
}
