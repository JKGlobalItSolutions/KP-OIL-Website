import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { CheckCircle } from 'lucide-react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';

const StyledOrderConfirmation = styled.div`
  padding: 2rem 0;

  .confirmation-title {
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

  .confirmation-card {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .success-icon {
    color: #28a745;
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .success-message {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
  }

  .order-details {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    border: 2px solid #A41E19;
  }

  .detail-title {
    color: #A41E19;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .detail-content {
    margin-bottom: 1rem;
  }

  .btn-continue-shopping {
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

  @media (max-width: 768px) {
    .confirmation-card {
      padding: 1rem;
    }

    .success-icon {
      font-size: 3rem;
    }

    .success-message {
      font-size: 1.2rem;
    }

    .btn-continue-shopping {
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
    }
  }
`;

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  if (!orderDetails) {
    navigate('/');
    return null;
  }

  const { formData, product } = orderDetails;

  return (
    <>
      <Header />
      <StyledOrderConfirmation>
        <Container>
          <div className="text-center mb-4">
            <h1 className="confirmation-title">Order Confirmation</h1>
          </div>
          <div className="confirmation-card">
            <div className="text-center">
              <CheckCircle className="success-icon" />
              <div className="success-message">Thank you for your order!</div>
            </div>
            <div className="order-details">
              <Row>
                <Col md={6}>
                  <div className="detail-title">Product Information</div>
                  <div className="detail-content">
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
                    <p><strong>Original Price:</strong> ₹{product.originalPrice.toFixed(2)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-title">Customer Information</div>
                  <div className="detail-content">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}</p>
                  </div>
                </Col>
              </Row>
              {formData.notes && (
                <Row>
                  <Col>
                    <div className="detail-title">Additional Notes</div>
                    <div className="detail-content">
                      <p>{formData.notes}</p>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
            <div className="text-center">
              <Button 
                className="btn-continue-shopping"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Container>
      </StyledOrderConfirmation>
      <Footer />
    </>
  );
};

export default OrderConfirmation;

