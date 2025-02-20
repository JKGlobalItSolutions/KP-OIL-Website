import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal, Image } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, ShoppingCart, X, ZoomIn } from 'lucide-react';
import { db, storage } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
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

import Banner1 from '../Images/Banner/Banner 1.jpg'
import Banner2 from '../Images/Banner/Banner 2.jpg'
import Banner3 from '../Images/Banner/Banner 3.jpg'

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
    cursor: pointer;
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

const ZoomModal = styled(Modal)`
  .modal-content {
    background-color: transparent;
    border: none;
  }

  .modal-body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .zoomed-image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .zoomed-image {
    max-width: 80%;
    max-height: 80vh;
    object-fit: contain;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.7);
    border: none;
    color: #333;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    z-index: 1050;

    &:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }

  @media (max-width: 1024px) {
    .zoomed-image {
      max-width: 90%;
      max-height: 90vh;
    }
  }

  @media (max-width: 768px) {
    .zoomed-image {
      max-width: 95%;
      max-height: 95vh;
    }

    .close-button {
      top: 5px;
      right: 5px;
      font-size: 20px;
      width: 30px;
      height: 30px;
    }
  }
`;

const BannerSlider = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  .slides {
    display: flex;
    transition: transform 0.5s ease;
  }

  .slide {
    min-width: 100%;
    box-sizing: border-box;
  }

  .slide img {
    width: 100%;
    display: block;
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 1000;
  }

  .prev {
    left: 10px;
  }

  .next {
    right: 10px;
  }
`;

const ImageNavButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  color: #333;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 10;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  &.prev {
    left: 5px;
  }

  &.next {
    right: 5px;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');
  const categoryRefs = useRef({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    setupScrollAnimation();

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

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
      const productsList = await Promise.all(productsSnapshot.docs.map(async (doc) => {
        const productData = doc.data();
        const images = await Promise.all((productData.images || []).map(async (imagePath) => {
          return await getDownloadURL(ref(storage, imagePath));
        }));
        return {
          id: doc.id,
          ...productData,
          images: images,
        };
      }));
      setProducts(productsList);
      setFilteredProducts(productsList);
      const bestSellerProducts = productsList.filter(product => product.category === 'Best Sellers');
      setBestSellers(bestSellerProducts);
      const newProductList = productsList.filter(product => product.category === 'New Products');
      setNewProducts(newProductList);

      const initialImageIndices = {};
      productsList.forEach(product => {
        initialImageIndices[product.id] = 0;
      });
      setCurrentImageIndex(initialImageIndices);
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

  const handleImageClick = (imageUrl) => {
    setZoomedImage(imageUrl);
    setShowZoomModal(true);
  };

  const handlePrevImage = (productId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + products.find(p => p.id === productId).images.length) % products.find(p => p.id === productId).images.length
    }));
  };

  const handleNextImage = (productId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % products.find(p => p.id === productId).images.length
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const renderProductCard = (product) => {
    const currentIndex = currentImageIndex[product.id] || 0;

    return (
      <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <Card className="h-100 m-lg-3 border-0 shadow-sm">
          <div className="position-relative" style={{ paddingTop: '100%' }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex">
              {product.images && product.images.length > 0 ? (
                <Card.Img
                  variant="top"
                  src={product.images[currentIndex]}
                  alt={`${product.name} - ${currentIndex + 1}`}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onClick={() => handleImageClick(product.images[currentIndex])}
                />
              ) : (
                <Card.Img
                  variant="top"
                  src="/placeholder.svg"
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <>
                <ImageNavButton
                  className="prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage(product.id);
                  }}
                >
                  <ChevronLeft size={24} />
                </ImageNavButton>
                <ImageNavButton
                  className="next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage(product.id);
                  }}
                >
                  <ChevronRight size={24} />
                </ImageNavButton>
              </>
            )}
            <Button 
              className="position-absolute top-0 end-0 m-2 p-1 bg-white rounded-circle"
              style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => handleImageClick(product.images && product.images.length > 0 ? product.images[currentIndex] : '/placeholder.svg')}
              variant="light"
            >
              <ZoomIn size={20} />
            </Button>
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
  };

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

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3);
  };

  return (
    <StyledHome>
      <Header onSearch={handleSearch} />

      <Container fluid className="px-0">
        <BannerSlider className="banner animate-on-scroll">
          <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <img className='img-fluid' src={Banner2} alt="Banner 1" />
            <img className='img-fluid' src={Banner1} alt="Banner 2" />
            <img className='img-fluid' src={Banner1} alt="Banner 3" />
          </div>
          <button className="nav-button prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="nav-button next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </BannerSlider>
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
                <Image src={selectedProduct.images[0]} alt={selectedProduct.name} className="product-image" />
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

      <ZoomModal
        show={showZoomModal}
        onHide={() => setShowZoomModal(false)}
        centered
        size="xl"
      >
        <Modal.Body>
          <div className="zoomed-image-container">
            <img src={zoomedImage} alt="Zoomed product" className="zoomed-image" />
            <button className="close-button" onClick={() => setShowZoomModal(false)}>
              <X size={24} />
            </button>
          </div>
        </Modal.Body>
      </ZoomModal>

      <Footer />
    </StyledHome>
  );
};

export default Home;
