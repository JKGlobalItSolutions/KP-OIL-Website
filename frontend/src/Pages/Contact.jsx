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
     
      <Footer />
    </div>
  );
};

export default Contact;

