import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal, Image } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { db, storage } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import HomeBanner from '../Images/Pages/Home/Home Banner.png';
import Panchalogam from '../Images/Pages/Home/Panchalogam.png';
import Rudhraksha from '../Images/Pages/Home/Rudhraksha.png';
import Karungali from '../Images/Pages/Home/Karungali.png';
import Statues from '../Images/Pages/Home/Statues.png';
import PureSilver from '../Images/Pages/Home/Pure Silver.png';
import Maalai from '../Images/Pages/Home/Malai.png';
import HomeBanner2 from '../Images/Pages/Home/Home content banner.png';
import Blog1 from '../Images/Pages/Home/Blog image 1 (2).png';
import Blog2 from '../Images/Pages/Home/Blog Image 2.png';
import Blog3 from '../Images/Pages/Home/Blog Image 3.png';
import "../Styles/Home.css";

const StyledHome = styled.div`
  font-family: 'Lora', serif;

  h1, h3 {
    text-align: center;
    font-weight: bolder;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .card {
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .card-img-top {
    object-fit: cover;
    height: 200px;
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .price {
    font-size: 1.2rem;
    font-weight: bold;
    color: #000;
    background-color: #FFE31A;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .original-price {
    text-decoration: line-through;
    color: #6c757d;
  }

  .btn-danger {
    background-color: #FF0000;
    border-color: #FF0000;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #D10000;
      border-color: #D10000;
    }
  }

  .scroll-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }
  }

  .container-fluid {
    width: 100%;
    padding-right: 0;
    padding-left: 0;
    margin-right: auto;
    margin-left: auto;
  }

  .row {
    margin-right: 0;
    margin-left: 0;
  }

  .col, [class*="col-"] {
    padding-right: 15px;
    padding-left: 15px;
  }
`;

const StyledCartModal = styled(Modal)`
  .modal-content {
    border-radius: 15px;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .modal-header {
    border-bottom: none;
    padding: 15px 15px 0;
    background-color: #f8f9fa;
  }

  .modal-body {
    padding: 15px;
    background-color: #f8f9fa;
  }

  .product-image {
    width: 100%;
    max-width: 120px;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
  }

  .product-title {
    color: #A41E19;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .price-display {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .current-price {
    font-size: 22px;
    font-weight: bold;
    color: #A41E19;
  }

  .original-price {
    text-decoration: line-through;
    color: #6c757d;
    font-size: 14px;
  }

  .savings {
    background-color: #FFE31A;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
    margin-bottom: 15px;
    font-weight: bold;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .divider {
    border-top: 1px solid #dee2e6;
    margin: 12px 0;
  }

  .price-summary {
    color: #A41E19;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
  }

  .grand-total {
    color: #A41E19;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding: 8px 0;
    border-top: 2px solid #A41E19;
    border-bottom: 2px solid #A41E19;
  }

  .btn-checkout {
    background-color: #FFE31A;
    border: none;
    color: black;
    font-weight: bold;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    &:hover {
      background-color: #e6cc17;
      color: black;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .btn-cancel {
    background-color: #A41E19;
    border: none;
    color: white;
    font-weight: bold;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    &:hover {
      background-color: #8a1915;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 15px;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 18px;
    color: #A41E19;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: #8a1915;
    }
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 400px;
    }
  }

  @media (max-width: 575px) {
    .modal-dialog {
      margin: 0.5rem;
    }

    .product-image {
      max-width: 100px;
    }

    .product-title {
      font-size: 18px;
    }

    .current-price {
      font-size: 20px;
    }

    .original-price {
      font-size: 12px;
    }

    .savings {
      font-size: 11px;
    }

    .price-summary {
      font-size: 14px;
    }

    .summary-row {
      font-size: 12px;
    }

    .grand-total {
      font-size: 16px;
    }

    .btn-checkout, .btn-cancel {
      padding: 6px 12px;
      font-size: 12px;
    }
  }

  @media (min-width: 992px) {
    .modal-dialog {
      max-width: 450px;
    }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categoryRefs = useRef({});

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    setupScrollAnimation();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = await Promise.all(categoriesSnapshot.docs.map(async (doc) => {
        const categoryData = doc.data();
        const imageUrl = await getDownloadURL(ref(storage, categoryData.image));
        return {
          id: doc.id,
          name: categoryData.name,
          image: imageUrl,
        };
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
      const bestSellerProducts = productsList.filter(product => product.category === 'Best Sellers');
      setBestSellers(bestSellerProducts);
      const newProductList = productsList.filter(product => product.category === 'New Products');
      setNewProducts(newProductList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const setupScrollAnimation = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
  };

  const renderProductCard = (product) => (
    <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 border-0 shadow-sm">
        <div className="position-relative" style={{ paddingTop: '100%' }}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <Card.Body className="text-center">
          <Card.Title className="fs-5 mb-3">{product.name}</Card.Title>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            <span className="fs-5 fw-bold px-2" style={{ color: '#000', backgroundColor: "#FFE31A" }}>
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-decoration-line-through text-muted">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          </div>
          <Button 
            variant="danger" 
            className="w-100"
            style={{ 
              backgroundColor: '#FF0000',
              borderColor: '#FF0000'
            }}
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  const scrollProducts = (ref, direction) => {
    const container = ref.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const renderScrollButtons = (ref) => (
    <>
      <button
        className="scroll-button left"
        onClick={() => scrollProducts(ref, 'left')}
      >
        <ChevronLeft size={24} color="#333" />
      </button>
      <button
        className="scroll-button right"
        onClick={() => scrollProducts(ref, 'right')}
      >
        <ChevronRight size={24} color="#333" />
      </button>
    </>
  );

  const handleCheckout = () => {
    setShowCartModal(false);
    navigate('/checkout', { state: { product: selectedProduct } });
  };

  return (
    <StyledHome>
      <Header />

      <Container fluid className="px-0">
        <div className="banner animate-on-scroll">
          <img className='img-fluid w-100' src={HomeBanner} alt="Home Banner" />
        </div>
      </Container>
      <Container fluid className="my-3 animate-on-scroll px-0">
        <h3 style={{fontFamily:"lora"}} className='text-center my-4 fw-bolder'>Shop By Category Items</h3>
        <Row className='justify-content-center mx-0'>
          <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
          <Link to="/panjaloga" >
          <img className='img-fluid w-100' src={Panchalogam} alt="Panchalogam" />
          </Link>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
         <Link to="/rudh" >
         <img className='img-fluid w-100' src={Rudhraksha} alt="Rudhraksha" />
         </Link>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
            <Link to="/karungali" >
            <img className='img-fluid w-100' src={Karungali} alt="Karungali" />
            </Link>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
           <Link to="/statues" >
           <img className='img-fluid w-100' src={Statues} alt="Statues" />
           </Link>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
           <Link to="/puresilver" >
           <img className='img-fluid w-100' src={PureSilver} alt="Pure Silver" />
           </Link>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
        <Link to="/maalai" >
        <img className='img-fluid w-100' src={Maalai} alt="Maalai" />
        </Link>
          </Col>
        </Row>
      </Container>
      <Container fluid className="my-3 animate-on-scroll px-0">
        <Row className='justify-content-center mx-0'>
          {categories.map((category) => (
            <Col xs={12} sm={6} md={4} lg={2} className="mb-3" key={category.id}>
              <img className='img-fluid w-100' src={category.image} alt={category.name} />
            </Col>
          ))}
        </Row>
      </Container>
      <Container fluid className="animate-on-scroll px-0">
        <h3>Best Sellers</h3>
        <Row>
          {bestSellers.map(renderProductCard)}
        </Row>
      </Container>
      <Container fluid className="animate-on-scroll px-0">
        <h3>New Products</h3>
        <Row>
          {newProducts.map(renderProductCard)}
        </Row>
      </Container>
      <Container fluid className="px-0 my-5 animate-on-scroll">
        <img className='img-fluid w-100' src={HomeBanner2} alt="Home Banner 2" />
      </Container>
      <Container fluid className="my-5 animate-on-scroll px-0">
        <h3>Our Blog</h3>
        <Row className="align-items-center mx-0">
          <Col xs={12} lg={4} className="my-2">
            <img className='img-fluid w-100' src={Blog1} alt="Blog 1" />
          </Col>
          <Col xs={12} lg={4} className="my-2">
            <img className='img-fluid w-100' src={Blog2} alt="Blog 2" />
          </Col>
          <Col xs={12} lg={4} className="my-2">
            <img className='img-fluid w-100' src={Blog3} alt="Blog 3" />
          </Col>
        </Row>
      </Container>

      <StyledCartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        centered
        size="sm"
      >
        <Modal.Header>
          <h6 style={{backgroundColor:"#A41E19", color:"#FFE31A"}} className='text-center py-2 px-3 rounded'>
            <ShoppingCart size={18} className="me-2" />
            Your Cart
          </h6>
          <button className="close-button text-light" onClick={() => setShowCartModal(false)}>
            <X size={28} />
          </button>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="text-center">
                <Image src={selectedProduct.image} alt={selectedProduct.name} className="product-image" />
              </div>
              <h2 className="product-title">{selectedProduct.name}</h2>
              <div className="price-display">
                <span className="current-price">₹{selectedProduct.price.toFixed(2)}</span>
                <span className="original-price">₹{selectedProduct.originalPrice.toFixed(2)}</span>
              </div>
              <div className="savings">
                You Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
              </div>
              <div className="divider"></div>
              <div className="price-summary">Price Summary</div>
              <div className="summary-row">
                <span>Total MRP (Incl. of taxes)</span>
                <span>₹{selectedProduct.originalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Cart Discount</span>
                <span>- ₹{(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}</span>
              </div>
              <div className="divider"></div>
              <div className="grand-total">
                <span>Grand Total</span>
                <span>₹{selectedProduct.price.toFixed(2)}</span>
              </div>
              <div className="button-container">
                <Button variant="secondary" className="btn-cancel" onClick={() => setShowCartModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="btn-checkout" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </StyledCartModal>

      <Footer />
    </StyledHome>
  );
};

export default Home;

