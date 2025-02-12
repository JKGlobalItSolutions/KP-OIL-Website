import React from 'react'
import { MapPin, Mail, Phone, Facebook, Youtube, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <div>
       <footer style={{backgroundColor: "black"}} className="text-light py-5">
      <div className="container mx-auto  ">
        <div className="row">


          <div className="col-md-6 col-lg-3 mb-4 text-center text-md-start">
            <h2 className="h4 mb-4">Products</h2>
            <ul className="list-unstyled">
              <li><a href="#" className="text-secondary text-decoration-none">Rings</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Kappu</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Statues</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Dollar</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Malai</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Rudraksha</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Karungali</a></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3 mb-4 text-center text-md-start">
            <h2 className="h4 mb-4">Category</h2>
            <ul className="list-unstyled">
              <li><a href="#" className="text-secondary text-decoration-none">Accessories</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Pooja Products</a></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3 mb-4 text-center text-md-start">
            <h2 className="h4 mb-4">Support</h2>
            <ul className="list-unstyled">
              <li><a href="#" className="text-secondary text-decoration-none">Help & Contact</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">FAQ</a></li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 text-center text-md-start">
            <h2 className="h4 mb-4">Contact Details</h2>
            <ul className="list-unstyled text-secondary">
              <li className="d-flex mb-3 justify-content-center justify-content-md-start">
                <MapPin className="flex-shrink-0 me-2 mt-1" size={20} />
                <div>
                  <p className="mb-0">No.1 Vada Othavadai Street</p>
                  <p className="mb-0">( Near Rettai Pillaiyar Kovil )</p>
                  <p className="mb-0">Tiruvannamalai.</p>
                </div>
              </li>
              <li className="d-flex mb-3 justify-content-center justify-content-md-start">
                <MapPin className="flex-shrink-0 me-2 mt-1" size={20} />
                <div>
                  <p className="mb-0">Girivalapathai, Varuna Lingam ( opp ),</p>
                  <p className="mb-0">Tiruvannamalai - 606 601</p>
                </div>
              </li>
              <li className="d-flex mb-3 justify-content-center justify-content-md-start">
                <Mail className="flex-shrink-0 me-2" size={20} />
                <a href="mailto:anbutum1@gmail.com" className="text-secondary text-decoration-none">
                  anbutum1@gmail.com
                </a>
              </li>
              <li className="d-flex mb-3 justify-content-center justify-content-md-start">
                <Phone className="flex-shrink-0 me-2" size={20} />
                <span>9443164102 / 6383002749</span>
              </li>
            </ul>
            <div className="d-flex justify-content-center justify-content-md-start">
              <a href="#" className="text-secondary me-3">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-secondary me-3">
                <Youtube size={24} />
              </a>
              <a href="#" className="text-secondary me-3">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-secondary">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default Footer
