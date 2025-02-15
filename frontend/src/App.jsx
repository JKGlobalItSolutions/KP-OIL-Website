import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ProfileProvider } from './Admin/ProfileContext';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Home from './Pages/Home';
import About from './Pages/About';
import AdminPanel from './Admin/AdminPanel';

import Login from './Admin/Login';
import Checkout from './Pages/Checkout'; // Import the new Checkout component
import OrderConfirmation from './Pages/OrderConfirmation';
import Contact from './Pages/Contact';
import Products from './Pages/Products';
import PlaceOrderConfirmation from './Pages/PlaceOrder';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/Login';

  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/groundnut" element={<Products />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contact" element={<Contact />} />
         
          <Route path="/checkout" element={<Checkout />} /> {/* Add the new Checkout route */}
          <Route path="/order-confirmation" element={<OrderConfirmation />} /> {/* Add the new Checkout route */}
          <Route path="/place-order" element={<PlaceOrderConfirmation />} /> {/* Add the new Checkout route */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ProfileProvider>
      <Router>
        <AppContent />
      </Router>
    </ProfileProvider>
  );
}

export default App;