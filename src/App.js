import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ProfileProvider } from './Admin/ProfileContext';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Header from "./Components/Header/Header";
import Home from './Pages/Home';
import About from './Pages/About';
import AdminPanel from './Admin/AdminPanel';
import Panchaloga from './Pages/Panchaloga';
import Rudraksha from './Pages/Rudraksha';
import Karungali from './Pages/Karungali';
import Statues from './Pages/Statues';
import PureSilver from './Pages/PureSilver';
import Maalai from './Pages/Maalai';
import Login from './Admin/Login';
import Checkout from './Pages/Checkout'; // Import the new Checkout component
import OrderConfirmation from './Pages/OrderConfirmation';
import Blog from './Pages/Blog';
import Contact from './Pages/Contact';

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
          <Route path="/panjaloga" element={<Panchaloga />} />
          <Route path="/rudh" element={<Rudraksha />} />
          <Route path="/karungali" element={<Karungali />} />
          <Route path="/statues" element={<Statues />} />
          <Route path="/puresilver" element={<PureSilver />} />
          <Route path="/maalai" element={<Maalai />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
         
          <Route path="/checkout" element={<Checkout />} /> {/* Add the new Checkout route */}
          <Route path="/order-confirmation" element={<OrderConfirmation />} /> {/* Add the new Checkout route */}
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