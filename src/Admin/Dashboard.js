import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StyledDashboard = styled.div`
  padding: 2rem 0;

  h2 {
    color: #A41E19;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  .card-title {
    color: #A41E19;
    font-weight: bold;
  }

  .card-text {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
  }

  @media (max-width: 768px) {
    padding: 1rem 0;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1rem;
    }

    .card-text {
      font-size: 1.5rem;
    }
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 576px) {
    display: none;
  }
`;

const MobileMessage = styled.p`
  display: none;
  text-align: center;
  color: #666;
  font-style: italic;

  @media (max-width: 576px) {
    display: block;
  }
`;

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsCount = productsSnapshot.docs.length;
      setTotalProducts(productsCount);

      // Fetch categories
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesCount = categoriesSnapshot.docs.length;
      setTotalCategories(categoriesCount);

      // Fetch orders
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersCount = ordersSnapshot.docs.length;
      setTotalOrders(ordersCount);

      // Prepare analytics data
      const analyticsData = [
        { name: 'Products', value: productsCount, fill: '#A41E19' },
        { name: 'Categories', value: categoriesCount, fill: '#FFE31A' },
        { name: 'Orders', value: ordersCount, fill: 'black' }
      ];
      setAnalyticsData(analyticsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to fetch dashboard data. Please try again.');
    }
  };

  return (
    <StyledDashboard>
      <div>
        <h2>Dashboard</h2>
        <Row>
          <Col xs={12} sm={6} md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Products</Card.Title>
                <Card.Text>{totalProducts}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Categories</Card.Title>
                <Card.Text>{totalCategories}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Orders</Card.Title>
                <Card.Text>{totalOrders}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Analytics Overview</Card.Title>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="value" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <MobileMessage>Chart not available on mobile devices. Please view on a larger screen.</MobileMessage>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </StyledDashboard>
  );
};

export default Dashboard;

