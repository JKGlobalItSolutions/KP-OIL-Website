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
      <img className='img-fluid' src={AboutBannner} alt="About Banner" />
      <div style={{fontFamily:"lora",color:"#686D76"}} className="container my-5 ">
        <h2 className='text-center fw-bolder ' style={{fontFamily:"lora",color:"black"}} >About US</h2>
        <p>Shree Rettai Pillaiyar is more than just a store—it is a cherished destination for those seeking to enrich their spiritual and cultural journeys. For years, we have been a trusted provider of high-quality pooja goods, ensuring that every ritual is performed with the purity and authenticity it deserves. Whether you are organizing a grand Maha Kumbabishekam, performing a Grahapravesam to sanctify your new home, conducting an Abishegam, celebrating the sacred bond of marriage, or arranging a Suba Vishesha Pooja like Yaham or Homam, we are here to provide all the essentials you need.</p>
        <p>Our collection reflects the depth and diversity of spiritual traditions, offering a wide range of meticulously crafted items. From the divine glow of Panjaloga rings and sacred Rudraksha malas to intricately designed kappu, maalai, and dollars, every product is chosen with care to honor the significance of your rituals. We also feature expertly carved statues that embody the beauty of devotion and items made from Karungali wood, revered for its spiritual properties.</p>
        <p>At Shree Rettai Pillaiyar, we cater to both wholesale and retail customers, ensuring that individuals, families, and religious institutions alike can access the finest products for their ceremonies. Our commitment extends beyond providing goods—we aim to preserve and promote the rich cultural heritage of pooja traditions.</p>
        <p>Rooted in the values of quality, authenticity, and service, we believe that every spiritual act deserves the best. With a deep understanding of the rituals and their significance, we ensure that our products resonate with the sacred energy that enriches your life and connects you to the divine. Trust Shree Rettai Pillaiyar to be your partner in spiritual fulfillment, offering a blend of tradition, devotion, and excellence.</p>
        <h2 className='text-center fw-bolder mt-5 mb-4 ' style={{fontFamily:"lora",color:"black"}} >Our Purpose</h2>
        <img className='img-fluid' src={AboutImage2} alt="Our Purpose" />
      </div>
      <div className="container">
        <div className="row justify-content-center align-items-center gap-5 text-center ">
          <div className="col-12 col-lg-2 ">
            <img className='img-fluid col-6 ' src={logo1} alt="Authenticity Logo" />
            <p className='mt-2 fw-bolder' >Authenticity</p>
          </div>
          <div className="col-12 col-lg-2 ">
            <img className='img-fluid col-6 ' src={logo2} alt="Quality Logo" />
            <p className='mt-2 fw-bolder' >Quality</p>
          </div>
          <div className="col-12 col-lg-2 ">
            <img className='img-fluid col-6 ' src={logo3} alt="Customer Satisfaction Logo" />
            <p className='mt-2 fw-bolder' >Customer Satisfaction</p>
          </div>
          <div className="col-12 col-lg-2 ">
            <img className='img-fluid col-6 ' src={logo4} alt="Spiritual Integrity Logo" />
            <p className='mt-2 fw-bolder' >Spiritual Integrity</p>
          </div>
        </div>
      </div>
      <div className="container">
        <h3>Why Should You Trust Us?</h3>
        <p>At Shree Rettai Pillaiyar, trust is the foundation of everything we do. Here's why countless customers rely on us for their spiritual and ceremonial needs</p>
        <p><span style={{color:"red"}}>Authenticity Guaranteed:</span> We offer only the highest quality, authentic pooja products crafted with care to uphold tradition and purity.</p>
        <p><span style={{color:"red"}}>Expertise You Can Count On:</span> With years of experience, we understand the significance of each ritual and ensure our products align with their spiritual requirements.</p>
        <p><span style={{color:"red"}}>Wide Range of Offerings:</span> From Panjaloga items and Rudraksha malas to Karungali artifacts, our extensive collection caters to every pooja need.</p>
        <p><span style={{color:"red"}}>Customer-Centric Approach:</span> We prioritize your satisfaction by providing personalized guidance and seamless shopping experiences, both in-store and online.</p>
        <p><span style={{color:"red"}}>Trusted by Thousands:</span> Our loyal customers and glowing testimonials reflect our commitment to excellence and trustworthiness.</p>
        <p><span style={{color:"red"}}>Fair Pricing:</span> We believe in delivering high-quality products at reasonable prices, ensuring value for every purchase.</p>
      </div>
      <div className="container my-5 ">
        {/* <ImageCarousel /> */}
      </div>
      <Footer/>
    </div>
  );
};

export default About;