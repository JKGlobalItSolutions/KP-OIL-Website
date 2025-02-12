import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';

const StyledCheckout = styled.div`
  padding: 2rem 0;
  
  .checkout-title {
    color: #A41E19;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    padding: 0.5rem 1rem;
    background-color: #FFE31A;
    display: inline-block;
    border-radius: 8px;
  }

  .checkout-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .form-control {
    border: 2px solid #A41E19;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(164, 30, 25, 0.25);
      border-color: #A41E19;
    }
  }

  .product-details {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    border: 2px solid #A41E19;
  }

  .product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 1rem;
  }

  .product-name {
    color: #A41E19;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #000;
    
    .original-price {
      text-decoration: line-through;
      color: #6c757d;
      font-size: 1rem;
      margin-left: 0.5rem;
    }
  }

  .btn-place-order {
    background-color: #FFE31A;
    border: none;
    color: #000;
    font-weight: bold;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #e6cc17;
      transform: translateY(-2px);
    }
  }

  .btn-cancel {
    background-color: #A41E19;
    border: none;
    color: white;
    font-weight: bold;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #8a1915;
      transform: translateY(-2px);
    }
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  textarea.form-control {
    min-height: 100px;
  }

  .error-message {
    color: #A41E19;
    text-align: center;
    margin-top: 1rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .checkout-form {
      padding: 1rem;
    }

    .product-image {
      width: 80px;
      height: 80px;
    }

    .product-name {
      font-size: 1.25rem;
    }

    .product-price {
      font-size: 1.1rem;
    }

    .btn-place-order, .btn-cancel {
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
    }
  }
`;

const OrderTemplate = ({ formData, product }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: 'white' }}>
      <h1 style={{ textAlign: 'center', color: '#A41E19' }}>Order Confirmation</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2 style={{ color: '#A41E19' }}>Product Information</h2>
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
        <p><strong>Original Price:</strong> ₹{product.originalPrice.toFixed(2)}</p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2 style={{ color: '#A41E19' }}>Customer Information</h2>
        <p><strong>Name:</strong> {formData.fullName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}</p>
      </div>
      
      {formData.notes && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2 style={{ color: '#A41E19' }}>Additional Notes</h2>
          <p>{formData.notes}</p>
        </div>
      )}
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const orderTemplateRef = useRef(null);

  if (!product) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderImage = async () => {
    if (orderTemplateRef.current) {
      const canvas = await html2canvas(orderTemplateRef.current);
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const imageDataUrl = await generateOrderImage();
      
      if (!imageDataUrl) {
        throw new Error('Failed to generate order image');
      }

      // Store order data in Firestore
      const orderData = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        productName: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        notes: formData.notes,
        date: serverTimestamp(),
        status: 'Pending'
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order added with ID: ', docRef.id);

      // Construct WhatsApp message with order details
      const whatsappNumber = '9894924809'; // Replace with your actual WhatsApp number
      const message = `
New Order Details:

Order ID: ${docRef.id}
Product: ${product.name}
Price: ₹${product.price.toFixed(2)}
Original Price: ₹${product.originalPrice.toFixed(2)}

Customer Information:
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}

Additional Notes:
${formData.notes || 'None'}
      `;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Navigate to order confirmation page
      navigate('/order-confirmation', { state: { orderDetails: { formData, product, orderId: docRef.id } } });
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error placing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="px-0">
        <h1 className="checkout-title text-center my-4">Checkout</h1>
      </Container>
      <StyledCheckout>
        <Container>
          <Form className="checkout-form" onSubmit={handleSubmit}>
            <div className="product-details d-flex align-items-center mb-4">
              <Image src={product.image} alt={product.name} className="product-image" />
              <div>
                <h2 className="product-name">{product.name}</h2>
                <div className="product-price">
                  ₹{product.price.toFixed(2)}
                  <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Full Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Control
                as="textarea"
                name="notes"
                placeholder="Add a note or special instructions"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>

            {error && <div className="error-message">{error}</div>}

            <div className="button-container">
              <Button 
                variant="secondary" 
                className="btn-cancel"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-place-order"
                disabled={isLoading}
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </Form>
        </Container>
      </StyledCheckout>
      <Footer />
      <div style={{ display: 'none' }}>
        <div ref={orderTemplateRef}>
          <OrderTemplate formData={formData} product={product} />
        </div>
      </div>
    </>
  );
};

export default Checkout;

