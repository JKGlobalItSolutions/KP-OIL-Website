"use client"

import React, { useState, useEffect, useRef } from "react"
import { Container, Card, Button, Modal } from "react-bootstrap"
import { X } from "lucide-react"
import { db } from "../firebase/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import Header from "../Components/Header/Header"
import Footer from "../Components/Footer/Footer"
import styled from "styled-components"

const StyledPanjaloga = styled.div`
  font-family: 'Lora', serif;
  background-color: white;
  color: black;

  h1 {
    text-align: center;
    font-weight: bolder;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  h3 {
    text-align: center;
    font-weight: bolder;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .card {
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    background-color: white;
    color: black;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .card-img-top {
    object-fit: cover;
    height: 200px;
    cursor: pointer;
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .price {
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    background-color: black;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .original-price {
    text-decoration: line-through;
    color: #6c757d;
  }

  .btn-outline-dark {
    background-color: transparent;
    border-color: black;
    color: black;
    transition: all 0.3s ease;

    &:hover {
      background-color: black;
      color: white;
    }
  }

  .product-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    gap: 1rem;
    padding: 1rem 0;

    &::-webkit-scrollbar {
      display: none;
    }
    
    & > div {
      scroll-snap-align: start;
      flex: 0 0 auto;
      width: 250px;
    }
  }

  @media (min-width: 768px) {
    .product-container {
      flex-wrap: nowrap;
      overflow-x: hidden;
      justify-content: flex-start;
      
      & > div {
        width: 25%;
        margin-right: 0;
      }
    }
  }
`

const ZoomModal = styled(Modal)`
  .modal-content {
    background-color: white;
    border: none;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .image-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-image-container {
    position: relative;
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  .main-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    aspect-ratio: 1;
  }

  .thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 2px;
    }
  }

  .thumbnail {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    object-fit: cover;

    &.active {
      border-color: black;
    }
  }

  .product-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .breadcrumb {
    font-size: 0.875rem;
    color: #666;
  }

  .product-title {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }

  .product-description {
    color: #666;
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #555;
    }
  }

  .size-selector {
    display: flex;
    gap: 1rem;
  }

  .size-option {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      border-color: black;
      background-color: black;
      color: white;
    }

    .price {
      font-weight: bold;
    }

    .mrp {
      font-size: 0.75rem;
      color: #666;
      text-decoration: line-through;
    }
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 1rem;

    label {
      color: #666;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    button {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }
    }

    input {
      width: 50px;
      height: 32px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }

  .total-section {
    display: flex;
    align-items: center;
    gap: 2rem;

    .total-amount {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    z-index: 10;

    &:hover {
      color: black;
    }
  }

  .add-to-cart-button {
    background-color: black;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #333;
    }
  }
`

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showContent, setShowContent] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [zoomedImage, setZoomedImage] = useState("")
  const categoryRefs = useRef({})
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomedProductIndex, setZoomedProductIndex] = useState(0)
  const [quantities, setQuantities] = useState({})
  const [hoveredProducts, setHoveredProducts] = useState({})

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products")
      const q = query(productsCollection, where("page", "==", "Products"))
      const productsSnapshot = await getDocs(q)

      if (!productsSnapshot.empty) {
        setShowContent(true)
        const productsList = productsSnapshot.docs.map((doc) => {
          const productData = doc.data()
          return {
            id: doc.id,
            ...productData,
            images: productData.images || [],
          }
        })
        setProducts(productsList)
        setFilteredProducts(productsList)

        const initialImageIndices = {}
        const initialQuantities = {}
        productsList.forEach((product) => {
          initialImageIndices[product.id] = 0
          initialQuantities[product.id] = 1
        })
        setCurrentImageIndex(initialImageIndices)
        setQuantities(initialQuantities)
      } else {
        setShowContent(false)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, "categories")
      const categoriesSnapshot = await getDocs(categoriesCollection)
      const categoriesList = categoriesSnapshot.docs.map((doc) => doc.data().name)
      setCategories(categoriesList)

      categoriesList.forEach((category) => {
        if (!categoryRefs.current[category]) {
          categoryRefs.current[category] = React.createRef()
        }
      })
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleImageClick = (product, imageIndex) => {
    setSelectedProduct(product)
    setZoomedImage(product.images[imageIndex])
    setZoomedProductIndex(imageIndex)
    setShowZoomModal(true)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleQuantityChange = (productId, change) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] + change),
    }))
  }

  const handleCheckout = (product) => {
    const productWithImage = {
      ...product,
      image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
    }
    navigate("/place-order", { state: { product: productWithImage, quantity: quantities[product.id] } })
  }

  const renderProductCard = (product) => {
    const currentImage =
      hoveredProducts[product.id] && product.images.length > 1 ? product.images[1] : product.images[0]

    return (
      <div key={product.id} className="flex-shrink-0 mb-4">
        <Card
          className="h-100 border-0 shadow-sm"
          style={{ width: "250px" }}
          onMouseEnter={() => setHoveredProducts((prev) => ({ ...prev, [product.id]: true }))}
          onMouseLeave={() => setHoveredProducts((prev) => ({ ...prev, [product.id]: false }))}
        >
          <div className="position-relative">
            <div
              className="position-absolute end-0 top-0 bg-dark text-white px-2 py-1 m-2 rounded-1"
              style={{ zIndex: 1 }}
            >
              DIS. {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>

            <Card.Img
              variant="top"
              src={currentImage || "/placeholder.svg"}
              alt={product.name}
              className="w-100"
              style={{ height: "280px", objectFit: "cover" }}
              onClick={() => handleImageClick(product, 0)}
            />
          </div>

          <Card.Body className="d-flex flex-column">
            <Card.Title className="fs-6 mb-2">{product.name}</Card.Title>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fs-5 fw-bold">₹{product.price.toFixed(2)}</span>
              <span className="text-decoration-line-through text-muted">₹{product.originalPrice.toFixed(2)}</span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(product.id, -1)}>
                -
              </Button>
              <span className="px-3 py-1 border rounded">{quantities[product.id]}</span>
              <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(product.id, 1)}>
                +
              </Button>
            </div>

            <div className="mt-auto">
              <Button variant="outline-dark" className="w-100" onClick={() => handleImageClick(product, 0)}>
                Buy Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Header onSearch={handleSearch} />

      {showContent && (
        <StyledPanjaloga>
          <Container>
            <h1>PRODUCTS</h1>
            {categories.map((category) => {
              const categoryProducts = filteredProducts.filter((product) => product.category === category)
              if (categoryProducts.length === 0) return null

              return (
                <div key={category} className="mb-5">
                  <h3>{category}</h3>
                  <div className="position-relative">
                    <div className="product-container" ref={categoryRefs.current[category]}>
                      {categoryProducts.map(renderProductCard)}
                    </div>
                  </div>
                </div>
              )
            })}
          </Container>
        </StyledPanjaloga>
      )}

      <ZoomModal show={showZoomModal} onHide={() => setShowZoomModal(false)} centered size="xl">
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="image-section">
                <div className="main-image-container">
                  <img src={zoomedImage || "/placeholder.svg"} alt={selectedProduct.name} className="main-image" />
                </div>
                <div className="thumbnails">
                  {selectedProduct.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`${selectedProduct.name} - ${index + 1}`}
                      className={`thumbnail ${index === zoomedProductIndex ? "active" : ""}`}
                      onClick={() => {
                        setZoomedImage(image)
                        setZoomedProductIndex(index)
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="product-details">
                <div className="breadcrumb">Product / {selectedProduct.category}</div>
                <h1 className="product-title">{selectedProduct.name}</h1>
                <p className="product-description">
                  {selectedProduct.description ||
                    "Cold pressed from superior quality full-grained Groundnuts, this oil is the best replacement as your everyday cooking oil. It preserves the natural qualities of the seeds and adds to the natural flavour and aroma to your dishes."}
                </p>
                <ul className="features-list">
                  <li>• Mild Nutty Flavour</li>
                  <li>• Healthier substitute for refined oils</li>
                  <li>• Rich in Vitamins and Essential Fatty Acids</li>
                  <li>• Natural clarification without refining keeps nutrients intact</li>
                </ul>
                <div className="size-selector">
                  <div className={`size-option ${selectedProduct.size === "1L" ? "active" : ""}`}>
                    <div>1 Litre</div>
                    <div className="price">₹ {selectedProduct.price}</div>
                    <div className="mrp">M.R.P. {selectedProduct.originalPrice}</div>
                  </div>
                </div>
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(selectedProduct.id, -1)}>-</button>
                    <input
                      type="number"
                      value={quantities[selectedProduct.id]}
                      onChange={(e) =>
                        handleQuantityChange(
                          selectedProduct.id,
                          Number.parseInt(e.target.value) - quantities[selectedProduct.id],
                        )
                      }
                    />
                    <button onClick={() => handleQuantityChange(selectedProduct.id, 1)}>+</button>
                  </div>
                </div>
                <div className="total-section">
                  <div className="total-amount">Total : ₹ {selectedProduct.price * quantities[selectedProduct.id]}</div>
                  <button
                    className="add-to-cart-button"
                    onClick={() => {
                      setShowZoomModal(false)
                      handleCheckout(selectedProduct)
                    }}
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
              <button className="close-button" onClick={() => setShowZoomModal(false)}>
                <X size={24} />
              </button>
            </>
          )}
        </Modal.Body>
      </ZoomModal>

      <Footer />
    </div>
  )
}

export default Products

