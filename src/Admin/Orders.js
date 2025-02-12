import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search } from 'lucide-react';

const StyledOrders = styled.div`
 

  .orders-title {
    color: #A41E19;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  .table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .table th {
    background-color: #A41E19;
    color: white;
    font-weight: bold;
  }

  .table td {
    vertical-align: middle;
  }

  .status-select {
    width: 120px;
  }

  .search-bar {
    margin-bottom: 1rem;
  }

  @media (max-width: 1024px) {
    .table-responsive {
      font-size: 0.9rem;
    }

    .status-select {
      width: 100%;
      font-size: 0.9rem;
    }

    .orders-title {
      font-size: 1.75rem;
    }
  }

  @media (max-width: 768px) {
    .table-responsive {
      font-size: 0.8rem;
    }

    .status-select {
      width: 100%;
      font-size: 0.8rem;
    }

    .orders-title {
      font-size: 1.5rem;
    }

    .table th, .table td {
      padding: 0.5rem;
    }
  }

  @media (max-width: 576px) {
    .table-responsive {
      font-size: 0.75rem;
    }

    .status-select {
      font-size: 0.75rem;
    }

    .orders-title {
      font-size: 1.25rem;
    }

    .table th, .table td {
      padding: 0.3rem;
    }
  }
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <StyledOrders>
      <div>
        <Row>
          <Col>
            <h1 className="orders-title">Orders</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="search-bar">
              <InputGroup.Text>
                <Search size={20} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.productName}</td>
                      <td>₹{order.price.toFixed(2)}</td>
                      <td>{new Date(order.date.toDate()).toLocaleString()}</td>
                      <td>{order.status}</td>
                      <td>
                        <Form.Select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
      <ToastContainer position="bottom-right" />
    </StyledOrders>
  );
};

export default Orders;

