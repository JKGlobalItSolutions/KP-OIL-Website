import React, { useState, useEffect } from 'react';
import Header from '../Components/Header/Header';
import "../Styles/Home.css";
import AboutBannner from '../Images/Pages/About/About banner.jpg'
import AboutImage2 from "../Images/Pages/About/About image 2.png"
import logo1 from "../Images/Pages/About/about logo 1.png"
import logo2 from "../Images/Pages/About/about logo 2.png"
import logo3 from "../Images/Pages/About/about logo 3.png"
import logo4 from "../Images/Pages/About/about logo 4.png"
import Footer from '../Components/Footer/Footer';
import Slide1 from '../Images/Pages/About/Slide1.png'
import Slide2 from '../Images/Pages/About/Slide 2.png'
import Slide3 from '../Images/Pages/About/Slide 3.png'

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

const About = () => {
  return (
    <div>
      <Header />
    
      <div className="container my-5 ">
        {/* <ImageCarousel /> */}
      </div>
      <Footer/>
    </div>
  );
};

export default About;