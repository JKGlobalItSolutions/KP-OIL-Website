import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaSearch, FaChevronDown } from 'react-icons/fa';
import styled from 'styled-components';
import logo from '../../Images/Logo/Rettai Pillayar logo.png';

const StyledHeader = styled.header`
  .welcome-banner {
    background-color: #FFF5E6;
    color: #8B4513;
    font-size: 0.8rem;
    padding: 0.5rem 0;
    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
  }

  .logo-image {
    height: 30px;
    @media (min-width: 768px) {
      height: 40px;
    }
    @media (min-width: 992px) {
      height: 50px;
    }
  }

  .store-name {
    color: #FF0000;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0;
    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
    @media (min-width: 992px) {
      font-size: 1.5rem;
    }
  }

  .store-subname {
    color: #000080;
    font-size: 0.8rem;
    margin-bottom: 0;
    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
    @media (min-width: 992px) {
      font-size: 1rem;
    }
  }

  .custom-navbar {
    background-color: #B22222;
  }

  .nav-link, .nav-item {
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.3s ease;
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0.5rem 1rem !important;
    
    @media (min-width: 992px) {
      font-size: 1rem;
      padding: 0.75rem 1.5rem !important;
    }
    
    &:hover, &:focus, &.active {
      color: #F4D35E !important;
      background-color: transparent;
    }
  }

  .dropdown-menu {
    margin-top: 0;
    border: none;
    border-radius: 8px;
    background-color: #B22222;
    padding: 0;
    min-width: 200px;
    
    @media (max-width: 991px) {
      position: static !important;
      float: none;
      width: 100%;
      margin-top: 0;
      background-color: transparent;
      border: 0;
      box-shadow: none;
      padding-left: 1rem;
      display: none;
      &.show {
        display: block;
      }
    }
    
    @media (min-width: 992px) {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: none;
    }
  }

  .dropdown-item {
    color: white;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-family: 'Lora', serif;
    text-align: left;
    padding: 0.5rem 1rem;
    
    @media (min-width: 992px) {
      font-size: 1rem;
      text-align: center;
    }
    
    &:last-child {
      border-bottom: none;
    }

    &:hover, &:focus, &.active {
      background-color: transparent;
      color: #F4D35E;
    }
  }

  .mobile-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-action-icon {
    font-size: 1.2rem;
    color: white;
  }

  .mobile-sign-in {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }

  .desktop-heart-icon {
    @media (min-width: 992px) {
      color: #FF0000 !important;
    }
  }

  @media (min-width: 992px) {
    .dropdown:hover .dropdown-menu {
      display: block;
    }
  }

  .dropdown {
    position: relative;
    width: 100%;

    @media (min-width: 992px) {
      width: auto;
    }
  }

  .dropdown-toggle::after {
    display: none;
  }

  .dropdown-icon {
    transition: transform 0.3s ease;
    margin-left: 0.5rem;
  }

  .dropdown.show .dropdown-icon {
    transform: rotate(180deg);
  }

  @media (max-width: 991px) {
    .nav-link {
      padding: 0.5rem 1rem !important;
      justify-content: flex-start;
    }

    .dropdown-menu {
      padding-left: 1rem;
    }

    .dropdown-item {
      padding: 0.5rem 0;
    }
  }

  .cart-icon-wrapper {
    position: relative;
    display: inline-block;
    font-size: 1.2rem;
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
    @media (min-width: 992px) {
      font-size: 1.75rem;
    }
  }

  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #FF0000;
    color: white;
    border-radius: 50%;
    font-size: 0.7rem;
    font-weight: bold;
    min-width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (min-width: 768px) {
      font-size: 0.75rem;
      min-width: 1.5rem;
      height: 1.5rem;
    }
  }

  .search-input {
    border-color: #B22222 !important;
    border-width: 2px !important;
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(178, 34, 34, 0.25) !important;
    }
  }

  .search-button {
    background-color: #B22222 !important;
    border-color: #B22222 !important;
    &:hover, &:focus {
      background-color: #8B0000 !important;
      border-color: #8B0000 !important;
    }
  }
`;

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const toggleProductsDropdown = (e) => {
    e.preventDefault();
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <StyledHeader>
      <div className="welcome-banner text-center">
        <small>Welcome to Shree Rettai Pillaiyar</small>
      </div>

      <Navbar bg="white" expand="lg" className="py-3 border-bottom">
        <Container fluid>
          <Row className="w-100 align-items-center g-3">
            <Col xs={12} lg={3} className="text-center text-lg-start">
              <Navbar.Brand href="/" className="d-flex align-items-center justify-content-center justify-content-lg-start">
                <img
                  src={logo}
                  alt="Shree Rettai Pillaiyar Logo"
                  className="d-inline-block me-2 logo-image"
                />
                <div>
                  <h1 className="store-name">
                    SHREE RETTAI PILLAIYAR
                  </h1>
                  <h2 className="store-subname">
                    POOJA STORES
                  </h2>
                </div>
              </Navbar.Brand>
            </Col>

            <Col xs={12} lg={6}>
              <Form onSubmit={handleSearch} className="px-2">
                <InputGroup className='ms-0 ms-lg-5' >
                  <Form.Control
                    type="search"
                    placeholder="Search Products & Categories"
                    className="search-input rounded-start-pill"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button 
                    variant="danger" 
                    type="submit"
                    className="search-button rounded-end-pill"
                  >
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>

            <Col xs={12} lg={3} className="d-none d-lg-block">
              <div className="d-flex align-items-center justify-content-end gap-4">
                {/* <Nav.Link href="/cart" className="p-0">
                  <div className="cart-icon-wrapper">
                    <FaShoppingCart className='text-danger me-lg-2  ' />
                    <span className="cart-badge">0</span>
                  </div>
                </Nav.Link>
                <Nav.Link href="/wishlist" className="p-0">
                  <FaHeart className="desktop-heart-icon" size={24} />
                </Nav.Link> */}
                <Button 
                  variant="danger" 
                  href='/login'
                  target='_blank'
                  className="rounded-pill px-4"
                  style={{ backgroundColor: '#B22222' }}
                >
                  SIGN IN
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Navbar expand="lg" className="py-0 custom-navbar">
        <Container fluid className="px-2">
          <div className="d-flex d-lg-none align-items-center w-100 py-2">
            <Navbar.Toggle 
              aria-controls="basic-navbar-nav-2" 
              className="border-0 text-white"
            />
            <div className="mobile-actions ms-auto">
              {/* <Nav.Link href="/cart" className="p-0">
                <div className="cart-icon-wrapper">
                  <FaShoppingCart className="mobile-action-icon text-white" />
                  <span className="cart-badge">0</span>
                </div>
              </Nav.Link>
              <Nav.Link href="/wishlist" className="p-0">
                <FaHeart className="mobile-action-icon" />
              </Nav.Link> */}
              <Button 
                variant="outline-light" 
                size="sm"
                className="rounded-pill bg-light text-danger mobile-sign-in"
                href='/login'
                target='_blank'
              >
                Sign In
              </Button>
            </div>
          </div>

          <Navbar.Collapse id="basic-navbar-nav-2">
            <Nav className="flex-column flex-lg-row justify-content-around w-100">
              <Nav.Item>
                <Nav.Link href="/">HOME</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/about">ABOUT US</Nav.Link>
              </Nav.Item>
              <Nav.Item className="dropdown">
                <Nav.Link
                  href="#"
                  onClick={toggleProductsDropdown}
                  className="d-flex justify-content-between align-items-center"
                >
                  PRODUCTS
                  <FaChevronDown className={`dropdown-icon ${isProductsOpen ? 'show' : ''}`} />
                </Nav.Link>
                <div className={`dropdown-menu ${isProductsOpen ? 'show' : ''}`}>
                  <Nav.Link href="/panjaloga" className="dropdown-item">Panjaloga</Nav.Link>
                  <Nav.Link href="/rudh" className="dropdown-item">Rudraksha</Nav.Link>
                  <Nav.Link href="/karungali" className="dropdown-item">Karungali</Nav.Link>
                  <Nav.Link href="/statues" className="dropdown-item">Statues</Nav.Link>
                  <Nav.Link href="/puresilver" className="dropdown-item">Pure Silver</Nav.Link>
                  <Nav.Link href="/maalai" className="dropdown-item">Malai</Nav.Link>
                </div>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/blog">BLOG</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/contact">CONTACT US</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </StyledHeader>
  );
};

export default Header;

