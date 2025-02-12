import React, { useState, useEffect } from "react";
import { Form, Button, Table, Image, Modal, InputGroup } from "react-bootstrap";
import { db, storage } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import styled from "styled-components";
import { Edit, Trash, Search, X, Plus } from 'lucide-react';

const StyledProductManagement = styled.div`
  h3 {
    color: #a41e19;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  .form-label {
    font-weight: 600;
    color: #333;
  }
  .form-control,
  .form-select {
    border-color: #ced4da;
    &:focus {
      border-color: #a41e19;
      box-shadow: 0 0 0 0.2rem rgba(164, 30, 25, 0.25);
    }
  }
  .btn-primary {
    background-color: #a41e19;
    border-color: #a41e19;
    font-weight: 600;
    padding: 0.5rem 1.5rem;
    &:hover,
    &:focus {
      background-color: #7d1713;
      border-color: #7d1713;
    }
  }
  .table {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    th {
      background-color: #a41e19;
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
    margin-right: 5px;
  }
  .btn-edit {
    background-color: #a41e19;
    border-color: #a41e19;
    color: #ffffff;
    &:hover,
    &:focus {
      background-color: #7d1713;
      border-color: #7d1713;
    }
  }
  .btn-delete {
    background-color: #000000;
    border-color: #000000;
    &:hover,
    &:focus {
      background-color: #333333;
      border-color: #333333;
    }
  }

  .search-bar {
    margin-bottom: 1rem;
  }

  .image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .image-preview-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .delete-image {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: #fff;
    border-radius: 50%;
    padding: 2px;
    cursor: pointer;
  }

  .form-image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .add-image-button {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ced4da;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      border-color: #a41e19;
    }
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
    th,
    td {
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
  const [searchTerm, setSearchTerm] = useState("");

  const [productName, setProductName] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [productPrice, setProductPrice] = useState("");
  const [productOriginalPrice, setProductOriginalPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPage, setProductPage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const pages = [
    "Home",
    "Panjaloga",
    "Rudraksha",
    "Karungali",
    "Statues",
    "Pure Silver",
    "Maalai",
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setProductImages((prevImages) => [...prevImages, ...newImages]);

      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setProductImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = async (index) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      if (editingProduct && editingProduct.images && editingProduct.images[index]) {
        try {
          const imageUrl = editingProduct.images[index];
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
          
          const updatedImages = [...editingProduct.images];
          updatedImages.splice(index, 1);
          
          const productRef = doc(db, "products", editingProduct.id);
          await updateDoc(productRef, { images: updatedImages });
          
          setEditingProduct({ ...editingProduct, images: updatedImages });
        } catch (error) {
          console.error("Error deleting image from storage:", error);
          alert("Failed to delete image from storage. Please try again.");
        }
      }
      
      setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setProductImagePreviews((prevPreviews) =>
        prevPreviews.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = editingProduct ? editingProduct.images || [] : [];

      if (productImages.length > 0) {
        const uploadPromises = productImages.map(async (image) => {
          const storageRef = ref(storage, `product_images/${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        });

        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const productData = {
        name: productName,
        images: imageUrls,
        price: parseFloat(productPrice),
        originalPrice: parseFloat(productOriginalPrice),
        category: productCategory,
        page: productPage,
      };

      if (editingProduct) {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, productData);
        alert("Product updated successfully!");
      } else {
        const productsRef = collection(db, "products");
        await addDoc(productsRef, productData);
        alert("Product added successfully!");
      }

      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      alert("Error adding/updating product. Please try again.");
    }
  };

  const resetForm = () => {
    setProductName("");
    setProductImages([]);
    setProductImagePreviews([]);
    setProductPrice("");
    setProductOriginalPrice("");
    setProductCategory("");
    setProductPage("");
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductImagePreviews(product.images || []);
    setProductPrice(product.price.toString());
    setProductOriginalPrice(product.originalPrice.toString());
    setProductCategory(product.category);
    setProductPage(product.page || "");
    setShowModal(true);
  };

  const handleDeleteImage = async (productId, imageUrl, index) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const productRef = doc(db, "products", productId);
        const updatedProduct = { ...products.find((p) => p.id === productId) };
        updatedProduct.images.splice(index, 1);
        await updateDoc(productRef, { images: updatedProduct.images });

        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        fetchProducts();
        alert("Image deleted successfully!");
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
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
            <th>Images</th>
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
                <div className="d-flex flex-wrap" style={{ gap: '5px' }}>
                  {product.images &&
                    product.images.map((image, index) => (
                      <div key={index} className="image-preview-wrapper">
                        <Image
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          thumbnail
                          className="product-image-preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <X
                          size={16}
                          className="delete-image"
                          onClick={() => handleDeleteImage(product.id, image, index)}
                        />
                      </div>
                    ))}
                </div>
              </td>
              <td>{product.name}</td>
              <td>₹{product.price.toFixed(2)}</td>
              <td>₹{product.originalPrice.toFixed(2)}</td>
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
                    <span className="btn-icon">
                      <Edit size={16} />
                    </span>
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-delete"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this product?"
                        )
                      ) {
                        try {
                          if (product.images && product.images.length > 0) {
                            const deletePromises = product.images.map(
                              async (imageUrl) => {
                                const imageRef = ref(storage, imageUrl);
                                return deleteObject(imageRef);
                              }
                            );
                            await Promise.all(deletePromises);
                          }
                          const productRef = doc(db, "products", product.id);
                          await deleteDoc(productRef);
                          fetchProducts();
                          alert("Product deleted successfully!");
                        } catch (error) {
                          console.error("Error deleting product:", error);
                          alert("Failed to delete product. Please try again.");
                        }
                      }
                    }}
                  >
                    <span className="btn-text">Delete</span>
                    <span className="btn-icon">
                      <Trash size={16} />
                    </span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
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
              <Form.Label>Product Images</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} multiple />
              <div className="image-preview-container d-flex flex-wrap align-items-start mt-3 ">
                {productImagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="image-preview-item d-flex align-items-start me-2 mb-2"
                  >
                    <Image
                      style={{ height: "100px", width: "auto" }}
                      src={preview}
                      thumbnail
                      className="form-image-preview"
                    />
                    <X
                      size={16}
                      className="delete-image ms-2"
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                ))}
              </div>
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
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </StyledProductManagement>
  );
};

export default ProductManagement;

