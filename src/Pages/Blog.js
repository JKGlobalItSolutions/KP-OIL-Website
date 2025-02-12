import React, { useState, useEffect } from 'react';
import Header from '../Components/Header/Header';
import "../Styles/Home.css";
import blog1 from "../Images/Blog/Blog image 1.png"
import blog2 from "../Images/Blog/Blog 2.png"
import blog3 from "../Images/Blog/Blog3.png"
import Blog4 from "../Images/Blog/Blog4.png"
import blog5 from "../Images/Blog/Blog5.png"
import blog6 from "../Images/Blog/Blog6.png"
import blog7 from "../Images/Blog/Blog7.png"
import blog8 from "../Images/Blog/Blog8.png"
import blog9 from "../Images/Blog/Blog10.png"
import Footer from '../Components/Footer/Footer';
import Slide1 from '../Images/Pages/About/Slide1.png'
import Slide2 from '../Images/Pages/About/Slide 2.png'
import Slide3 from '../Images/Pages/About/Slide 3.png'
import banner from '../Images/Blog/Blog banner.jpg'

const ImageCarousel = () => { 
  const [images, setImages] = useState([
    Slide1,
    Slide2,
    Slide3
  ]);
  const [transitioning, setTransitioning] = useState(false);

  const nextSlide = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setImages(prevImages => {
        const updatedImages = [...prevImages];
        const firstImage = updatedImages.shift();
        updatedImages.push(firstImage);
        return updatedImages;
      });
      setTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setImages(prevImages => {
        const updatedImages = [...prevImages];
        const lastImage = updatedImages.pop();
        updatedImages.unshift(lastImage);
        return updatedImages;
      });
      setTransitioning(false);
    }, 500);
  };

  return (
    <div className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
      <div className="d-flex justify-content-center align-items-center  h-100">
        {images.map((image, index) => (
          <div
            key={image}
            className="position-absolute"
            style={{
              transform: `translateX(${(index - 1) * 300}px)`,
              opacity: index === 1 ? 1 : 0.5,
              transition: 'all 0.5s ease',
              zIndex: index === 1 ? 2 : 1
            }}
          >
            <img
              src={image}
              alt={`Testimonial Slide ${index + 1}`}
              className=""
              style={{
            
                width: '340px',
                height: '390px',
                transform: `scale(${index === 1 ? 1 : 0.8})`,
                transition: 'all 0.5s ease'
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="position-absolute start-0 top-50 translate-middle-y btn btn-primary"
        style={{ left: '20px', zIndex: 3 }}
        aria-label="Previous slide"
      >
        &#8249;
      </button>
      <button
        onClick={nextSlide}
        className="position-absolute end-0 top-50 translate-middle-y btn btn-primary"
        style={{ right: '20px', zIndex: 3 }}
        aria-label="Next slide"
      >
        &#8250;
      </button>
    </div>
  );
};

const Blog = () => {
  return (
    <div>
      <Header />
      <div className="banner">
        <img className='img-fluid' src={banner} alt="" />
      </div>
      <div className="container p-5 ">
        <div className="row  ">
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog1}  alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog2} alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog3} />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={Blog4}  alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img  className='img-fluid' src={blog5}  alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog6}  alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog7} alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog8} alt="" />
          </div>
          <div className="col-12 col-lg-4 my-2 ">
              <img className='img-fluid' src={blog9} alt="" />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Blog;