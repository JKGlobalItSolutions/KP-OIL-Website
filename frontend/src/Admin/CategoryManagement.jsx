import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import styled from 'styled-components';
import { Edit, Trash } from 'lucide-react';

const StyledCategoryManagement = styled.div`
  h3 {
    color: #A41E19;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .form-label {
    font-weight: 600;
    color: #333;
  }

  .form-control {
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

  .btn-delete {
    background-color: #000000;
    border-color: #000000;
    color: #ffffff;
    font-weight: 600;
    padding: 0.3rem 1rem;
    &:hover, &:focus {
      background-color: #333333;
      border-color: #333333;
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

  @media (max-width: 768px) {
    h3 {
      font-size: 1.5rem;
    }

    .btn-primary {
      padding: 0.4rem 1rem;
    }

    .table {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 576px) {
    .table {
      font-size: 0.8rem;
    }

    .btn-primary, .btn-delete {
      padding: 0.3rem 0.8rem;
      font-size: 0.8rem;
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

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories. Please try again.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === '') {
      alert('Please enter a category name.');
      return;
    }
    try {
      const categoriesRef = collection(db, 'categories');
      await addDoc(categoriesRef, { name: newCategory });
      setNewCategory('');
      fetchCategories();
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setModalAction('edit');
    setShowModal(true);
  };

  const handleDeleteCategory = (category) => {
    setEditCategory(category);
    setModalAction('delete');
    setShowModal(true);
  };

  const updateProductsCollection = async (oldCategoryName, newCategoryName) => {
    try {
      const productsCollection = collection(db, 'products');
      const q = query(productsCollection, where('category', '==', oldCategoryName));
      const productsSnapshot = await getDocs(q);

      const updatePromises = productsSnapshot.docs.map((productDoc) =>
        updateDoc(doc(db, 'products', productDoc.id), { category: newCategoryName })
      );

      await Promise.all(updatePromises);
      console.log(`Products updated successfully for category ${oldCategoryName}`);
    } catch (error) {
      console.error('Error updating products collection:', error);
      throw new Error('Failed to update products.');
    }
  };

  const handleUpdateCategory = async () => {
    if (editCategory.name.trim() === '') {
      alert('Please enter a category name.');
      return;
    }
    try {
      const categoryRef = doc(db, 'categories', editCategory.id);

      // Get the old category name
      const oldCategoryName = categories.find((category) => category.id === editCategory.id)?.name;

      // Update the category name in the categories collection
      await updateDoc(categoryRef, { name: editCategory.name });

      // Update the category name in the products collection
      await updateProductsCollection(oldCategoryName, editCategory.name);

      setShowModal(false);
      fetchCategories();
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const categoryRef = doc(db, 'categories', editCategory.id);
      await deleteDoc(categoryRef);
      setShowModal(false);
      fetchCategories();
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  return (
    <StyledCategoryManagement>
      <h3>Category Management</h3>
      
      <Form onSubmit={handleAddCategory} className="mb-4">
        <Form.Group>
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          Add Category
        </Button>
      </Form>
      
      <ResponsiveTable striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <div className="btn-group">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="me-2"
                  >
                    <span className="btn-text">Edit</span>
                    <span className="btn-icon"><Edit size={16} /></span>
                  </Button>
                  <Button
                    className="btn-delete"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction === 'edit' ? 'Edit Category' : 'Delete Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === 'edit' ? (
            <Form>
              <Form.Group>
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editCategory?.name || ''}
                  onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                  placeholder="Enter category name"
                  required
                />
              </Form.Group>
            </Form>
          ) : (
            <p>Are you sure you want to delete the category "{editCategory?.name}"?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {modalAction === 'edit' ? (
            <Button variant="primary" onClick={handleUpdateCategory}>
              Update
            </Button>
          ) : (
            <Button className="btn-delete" onClick={handleConfirmDelete}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </StyledCategoryManagement>
  );
};

export default CategoryManagement;

