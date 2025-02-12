import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import Banner from '../Images/Contact/Contactbanner.jpg';
import box1 from '../Images/Contact/Contact box 1.png';
import box2 from '../Images/Contact/Contact box 2.png';
import box3 from '../Images/Contact/Contact box 3.png';
import "../Styles/Home.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create WhatsApp message
      const whatsappMessage = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`;
      const whatsappLink = `https://wa.me/919894924809?text=${whatsappMessage}`;

      // Open WhatsApp link in a new tab
      window.open(whatsappLink, '_blank');

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      alert('Thank you for your message. We will get back to you soon!');
    } catch (error) {
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="banner-container">
        <img className="img-fluid "  src={Banner} alt="Contact Us Banner" />
      </div>
      <h2 className="text-center fw-bolder mt-3">Contact Us</h2>
      <Container className="py-5">
        <Row>
          <Col xs={12} lg={4} className="mb-3 mb-lg-0">
            <img className="img-fluid" src={box1} alt="Contact Box 1" />
          </Col>
          <Col xs={12} lg={4} className="mb-3 mb-lg-0">
            <img className="img-fluid" src={box2} alt="Contact Box 2" />
          </Col>
          <Col xs={12} lg={4}>
            <img className="img-fluid" src={box3} alt="Contact Box 3" />
          </Col>
        </Row>
      </Container>
      <div style={{backgroundColor:"#A41E19"}} className="contact-form-container py-5 position-relative overflow-hidden">
        <Container>
          <div className="contact-form bg-white p-4 p-md-5 rounded-3 shadow position-relative">
            <h2 className="text-danger text-center fs-1 fw-bold mb-3 text-uppercase">Get in touch!</h2>
            <p className="text-center mb-4 text-danger">We would love to hear from you.</p>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-danger fw-bold">Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="border-warning bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-danger fw-bold">Your Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="border-warning bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="text-danger fw-bold">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="border-warning bg-light"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-danger fw-bold">Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={6}
                  className="border-warning bg-light"
                />
              </Form.Group>

              <div className="text-center">
                <Button 
                  className="btn-danger px-4 py-2 fw-bold text-uppercase rounded-pill"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

