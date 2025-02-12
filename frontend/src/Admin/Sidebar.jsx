import React, { useState, useEffect } from 'react';
import { Nav, Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { Home, Box, Settings, X, LogOut, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import logo from "../Images/Logo/Rettai Pillayar logo.png";

const StyledSidebar = styled.div`
  background-color: rgb(163, 29, 24);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  height: 100%;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 991px) {
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }

  .nav-link {
    color: #e0e0e0;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    &:hover,
    &:focus {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      color: #ffffff;
      background-color: black;
      box-shadow: 0 2px 10px rgba(164, 30, 25, 0.3);
    }

    svg {
      margin-right: 0.75rem;
    }
  }

  .brand {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;

    svg {
      margin-right: 0.5rem;
    }
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: none;

    @media (max-width: 991px) {
      display: block;
    }
  }
`;

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleShowLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseLogoutModal();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <StyledSidebar isOpen={isOpen}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
        <div className="text-center">
          <img
            style={{ height: "100px" }}
            className="img-fluid text-center"
            src={logo}
            alt="Rettai Pillayar logo"
          />
        </div>
        <div className="brand">
          <Settings size={24} />
          Admin Panel
        </div>
        <Nav className="flex-column">
          <Nav.Link
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => {
              setActivePage("dashboard");
              setIsOpen(false);
            }}
          >
            <Home size={18} />
            Dashboard
          </Nav.Link>
          <Nav.Link
            className={activePage === "categories" ? "active" : ""}
            onClick={() => {
              setActivePage("categories");
              setIsOpen(false);
            }}
          >
            <Box size={18} />
            Categories
          </Nav.Link>
          <Nav.Link
            className={activePage === "products" ? "active" : ""}
            onClick={() => {
              setActivePage("products");
              setIsOpen(false);
            }}
          >
            <Box size={18} />
            Products
          </Nav.Link>
          <Nav.Link
            className={activePage === "orders" ? "active" : ""}
            onClick={() => {
              setActivePage("orders");
              setIsOpen(false);
            }}
          >
            <ShoppingBag size={18} />
            Orders
          </Nav.Link>
          <Nav.Link
            className={activePage === "settings" ? "active" : ""}
            onClick={() => {
              setActivePage("settings");
              setIsOpen(false);
            }}
          >
            <Settings size={18} />
            Settings
          </Nav.Link>
          <Nav.Link
            onClick={() => {
              handleShowLogoutModal();
              setIsOpen(false);
            }}
          >
            <LogOut size={18} />
            Logout
          </Nav.Link>
        </Nav>
      </StyledSidebar>

      <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sidebar;

