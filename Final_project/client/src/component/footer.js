import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>
            We are a dedicated team providing high-quality products and exceptional customer service.
            Our mission is to make shopping easy, reliable, and enjoyable for everyone.
          </p>
        </div>
        
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul style={{listStyle:'none'}}>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p><strong>Email:</strong> khoa@example.com</p>
          <p><strong>Phone:</strong> +1 (123) 456-7890</p>
          <p><strong>Address:</strong> 1234 Street Name, City, Country</p>
        </div>

        <div className="footer-section social">
          <h2>Follow Us</h2>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"  style={{marginLeft:"10px"}}>Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{marginLeft:"10px"}}>Instagram</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
