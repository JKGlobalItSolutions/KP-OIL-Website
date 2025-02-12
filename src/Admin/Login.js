import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import styled from 'styled-components';
import { Eye, EyeOff } from 'lucide-react';

const StyledLogin = styled.div`
  padding: 2rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #A41E19;

  h2 {
    color: #A41E19;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .form-label {
    color: #333;
    font-weight: bold;
  }

  .form-control {
    border-radius: 5px;
    border: 1px solid #ced4da;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
      border-color: #A41E19;
      box-shadow: 0 0 0 0.2rem rgba(164, 30, 25, 0.25);
    }
  }

  .btn-primary {
    background-color: #A41E19;
    border-color: #A41E19;
    font-weight: bold;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

    &:hover, &:focus {
      background-color: #8B1915;
      border-color: #8B1915;
    }
  }

  .btn-outline-secondary {
    color: #A41E19;
    border-color: #ced4da;

    &:hover, &:focus {
      color: #fff;
      background-color: #A41E19;
      border-color: #A41E19;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 0;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by the useEffect hook
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledLogin>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card>
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">Admin Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Log In
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </StyledLogin>
  );
};

export default Login;

