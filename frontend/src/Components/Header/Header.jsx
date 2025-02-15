"use client"

import React, { useState, useEffect } from "react"
import { Navbar, Nav, Container, Form, Button, InputGroup, Row, Col } from "react-bootstrap"
import { FaSearch, FaChevronRight, FaPlus } from "react-icons/fa"
import styled from "styled-components"
import logo from "../../Images/Logo/Logo.jpg"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"

const StyledHeader = styled.header`
  .welcome-banner {
    background-color: #000000;
    color: white;
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
      height: 70px;
    }
  }

  .store-name {
    color: #000000;
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
    color: #000000;
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
    background-color: white;
  }

  .nav-link, .nav-item {
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.3s ease;
    color: black !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0.5rem 1rem !important;
    
    @media (min-width: 992px) {
      font-size: 1rem;
      padding: 0.75rem 1.5rem !important;
      justify-content: center;
      white-space: nowrap; /* Prevent text wrapping */
    }
    
    &:hover, &:focus, &.active {
      color: #808080 !important;
      background-color: transparent;
    }
  }

  .dropdown-menu {
    margin-top: 0;
    border: none;
    border-radius: 0;
    background-color: #FFFFFF;
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
      border-radius: 8px;
    }
  }

  .dropdown-item {
    color: #666;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    @media (min-width: 992px) {
      font-size: 1rem;
      text-align: center;
      justify-content: center;
    }
    
    &:last-child {
      border-bottom: none;
    }

    &:hover, &:focus, &.active {
      background-color: transparent;
      color: #808080;
    }
  }

  .mobile-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-action-icon {
    font-size: 1.2rem;
    color: black;
  }

  .mobile-sign-in {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }

  .desktop-heart-icon {
    @media (min-width: 992px) {
      color: #000000 !important;
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
      padding: 0.875rem 1rem !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      color: #333 !important;
      font-weight: 400;
    }

    .dropdown-menu {
      padding-left: 0;
      background-color: #f8f9fa;
      
      &.show {
        display: block;
      }
    }

    .dropdown-item {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      color: #666;
      font-weight: 400;
      
      &:last-child {
        border-bottom: none;
      }
    }

    .chevron-icon {
      color: #666;
      font-size: 1rem;
    }

    .navbar-collapse {
      max-height: calc(100vh - 100px);
      overflow-y: auto;
    }

    .navbar-toggler {
      border: none;
      padding: 0;
      &:focus {
        box-shadow: none;
      }
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
    background-color: #000000;
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
    border-color: #000000 !important;
    border-width: 2px !important;
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.25) !important;
    }
  }

  .search-button {
    background-color: #000000 !important;
    border-color: #000000 !important;
    &:hover, &:focus {
      background-color: #808080 !important;
      border-color: #808080 !important;
    }
  }

  .search-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 300px;
    background-color: white;
    border: 1px solid #000000;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: none;
    
    &.show {
      display: block;
    }
  }

  .search-icon {
    cursor: pointer;
    font-size: 1.2rem;
    color: #000000;
  }

  .mobile-menu-item {
    @media (max-width: 991px) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin: 0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .submenu-item {
    @media (max-width: 991px) {
      padding-left: 1.5rem;
      background-color: #f8f9fa;
    }
  }

  .mobile-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }

  .mobile-navbar-row {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  .premium-arrow {
    font-size: 1.2rem;
    color: #000000;
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  .dropdown.show .premium-arrow {
    transform: rotate(180deg);
  }
`

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])

  // Define navigation structure
  const navigation = {
    HOME: { path: "/" },
    "ABOUT US": { path: "/about" },
    SHOP: {
      items: {
        "Groundnut Oil": "/groundnut",
      }
    },
    "CONTACT US": { path: "/contact" }
  }

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products")
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setFilteredProducts(productsList)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
    setIsSearchOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <StyledHeader>
      <div className="welcome-banner text-center">
        <small>Welcome to KP Oil Extraction Company</small>
      </div>

      <Navbar bg="white" expand="lg" className="py-3 border-bottom">
        <Container fluid>
          <Row className="w-100 align-items-center g-3">
            <Col xs={12} lg={3} className="text-center text-lg-start">
              <Navbar.Brand
                href="/"
                className="d-flex align-items-center justify-content-center justify-content-lg-start"
              >
                <div className="">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Shree Rettai Pillaiyar Logo"
                    className="d-inline-block me-2 logo-image"
                  />
                </div>
              </Navbar.Brand>
            </Col>

            <Col xs={12} lg={6}>
              <div className="mobile-navbar-row d-flex d-lg-none align-items-center">
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-black" />
                <div className="mobile-buttons">
                  <FaSearch className="search-icon" onClick={toggleSearch} />
                  <Button
                    variant="dark"
                    href="/login"
                    target="_blank"
                    className="rounded-pill px-3"
                    style={{ backgroundColor: "#000000" }}
                  >
                    SIGN IN
                  </Button>
                </div>
              </div>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-center">
                  {Object.entries(navigation).map(([name, details]) => (
                    <Nav.Item key={name} className={details.items ? "dropdown" : ""}>
                      {details.items ? (
                        <>
                          <Nav.Link
                            href="#"
                            onClick={() => toggleSubmenu(name)}
                            className="d-flex justify-content-between align-items-center"
                          >
                            {name}
                            <FaPlus className="premium-arrow d-lg-none" />
                          </Nav.Link>
                          <div className={`dropdown-menu ${activeSubmenu === name ? "show" : ""}`}>
                            {Object.entries(details.items).map(([itemName, path]) => (
                              <Nav.Link key={itemName} href={path} className="dropdown-item submenu-item">
                                {itemName}
                              </Nav.Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Nav.Link href={details.path} className="d-flex justify-content-between align-items-center">
                          {name}
                        </Nav.Link>
                      )}
                    </Nav.Item>
                  ))}
                </Nav>
              </Navbar.Collapse>
            </Col>

            <Col xs={12} lg={3} className="d-flex justify-content-end align-items-center d-none d-lg-flex">
              <div className="position-relative me-3">
                <FaSearch className="search-icon" onClick={toggleSearch} />
                <div className={`search-dropdown ${isSearchOpen ? "show" : ""}`}>
                  <Form onSubmit={handleSearch} className="p-2">
                    <InputGroup>
                      <Form.Control
                        type="search"
                        placeholder="Search Products & Categories"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          onSearch(e.target.value)
                        }}
                      />
                      <Button variant="dark" type="submit" className="search-button">
                        <FaSearch />
                      </Button>
                    </InputGroup>
                  </Form>
                </div>
              </div>
              <Button
                variant="dark"
                href="/login"
                target="_blank"
                className="rounded-pill px-4"
                style={{ backgroundColor: "#000000" }}
              >
                SIGN IN
              </Button>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </StyledHeader>
  )
}

export default Header