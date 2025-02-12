import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Image, Modal, InputGroup } from 'react-bootstrap';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import styled from 'styled-components';
import { Edit, Trash, Search } from 'lucide-react';

const StyledProductManagement = styled.div`
  h3 {
    color: #A41E19;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  .form-label {
    font-weight: 600;
    color: #333;
  }
  .form-control, .form-select {
    border-color: #ced4da;
    &:focus {
      border-color: #A41E19;
      box-shadow: 0 0 0 0.2rem rgba(164, 30, 25, 0.25);
    }
  }
  .btn-primary {
    background-color: #A41E19;
    border-color: #A41E19;
    font-weight: 600;
    padding: 0.5rem 1.5rem;
    &:hover, &:focus {
      background-color: #7d1713;
      border-color: #7d1713;
    }
  }
  .table {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    th {
      background-color: #A41E19;
      color: #ffffff;
    }
    td {
      vertical-align: middle;
    }
  }
  .product-image-preview {
    max-width: 100px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  .btn-edit {
    background-color: #A41E19;
    border-color: #A41E19;
    color: #ffffff;
    &:hover, &:focus {
      background-color: #7d1713;
      border-color: #7d1713;
    }
  }
  .btn-delete {
    background-color: #000000;
    border-color: #000000;
    &:hover, &:focus {
      background-color: #333333;
      border-color: #333333;
    }
  }

  .search-bar {
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.5rem;
    }
    .btn-primary {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
    }
    .table {
      font-size: 0.9rem;
    }
    .product-image-preview {
      max-width: 60px;
    }
  }

  @media (max-width: 576px) {
    h3 {
      font-size: 1.3rem;
    }
    .btn-primary {
      padding: 0.3rem 0.8rem;
      font-size: 0.8rem;
    }
    .table {
      font-size: 0.8rem;
    }
    .product-image-preview {
      max-width: 50px;
    }
  }
`;

const ResponsiveTable = styled(Table)`
  @media (max-width: 768px) {
    th, td {
      padding: 0.5rem;
    }

    .btn-group {
      display: flex;
      justify-content: flex-end;
    }

    .btn-group .btn {
      padding: 0.25rem 0.5rem;
      margin-left: 0.5rem;
    }

    .btn-text {
      display: none;
    }

    .btn-icon {
      display: inline-block;
    }
  }

  @media (min-width: 769px) {
    .btn-icon {
      display: none;
    }
  }
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOriginalPrice, setProductOriginalPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPage, setProductPage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const pages = ['Home', 'Panjaloga', 'Rudraksha', 'Karungali', 'Statues', 'Pure Silver', 'Maalai'];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products. Please try again.');
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProductImage(e.target.files[0]);
      setProductImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editingProduct ? editingProduct.image : '';

      if (productImage) {
        const storageRef = ref(storage, `product_images/${productImage.name}`);
        await uploadBytes(storageRef, productImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        name: productName,
        image: imageUrl,
        price: parseFloat(productPrice),
        originalPrice: parseFloat(productOriginalPrice),
        category: productCategory,
        page: productPage,
      };

      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, productData);
        alert('Product updated successfully!');
      } else {
        const productsRef = collection(db, 'products');
        await addDoc(productsRef, productData);
        alert('Product added successfully!');
      }

      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding/updating product:', error);
      alert('Error adding/updating product. Please try again.');
    }
  };

  const resetForm = () => {
    setProductName('');
    setProductImage(null);
    setProductImagePreview('');
    setProductPrice('');
    setProductOriginalPrice('');
    setProductCategory('');
    setProductPage('');
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductImagePreview(product.image);
    setProductPrice(product.price.toString());
    setProductOriginalPrice(product.originalPrice.toString());
    setProductCategory(product.category);
    setProductPage(product.page || '');
    setShowModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledProductManagement>
      <h3>Product Management</h3>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Product
      </Button>

      <h3 className="mt-5">Product List</h3>
      <InputGroup className="search-bar">
        <InputGroup.Text>
          <Search size={20} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <ResponsiveTable striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Original Price</th>
            <th>Category</th>
            <th>Page</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <Image src={product.image} alt={product.name} thumbnail className="product-image-preview" />
              </td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>${product.originalPrice.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>{product.page}</td>
              <td>
                <div className="btn-group">
                  <Button
                    variant="secondary"
                    className="me-2 btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    <span className="btn-text">Edit</span>
                    <span className="btn-icon"><Edit size={16} /></span>
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-delete"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        try {
                          if (product.image) {
                            const imageRef = ref(storage, product.image);
                            await deleteObject(imageRef);
                          }
                          const productRef = doc(db, 'products', product.id);
                          await deleteDoc(productRef);
                          fetchProducts();
                          alert('Product deleted successfully!');
                        } catch (error) {
                          console.error('Error deleting product:', error);
                          alert('Failed to delete product. Please try again.');
                        }
                      }
                    }}
                  >
                    <span className="btn-text">Delete</span>
                    <span className="btn-icon"><Trash size={16} /></span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                required={!editingProduct}
              />
              {productImagePreview && (
                <Image src={productImagePreview} thumbnail className="mt-2 product-image-preview" />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Original Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={productOriginalPrice}
                onChange={(e) => setProductOriginalPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Page</Form.Label>
              <Form.Select
                value={productPage}
                onChange={(e) => setProductPage(e.target.value)}
                required
              >
                <option value="">Select Page</option>
                {pages.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </StyledProductManagement>
  );
};

export default ProductManagement;

