import React from 'react';
import './Aboutus.css'; // CSS file for styling
import Footer from '../component/footer'; 

const Aboutus = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        <div className="aboutus-text">
          <h1>About Us</h1>
          <p>
            Welcome to our company! We are committed to providing the best service to our customers. Our mission is to deliver high-quality products while ensuring excellent customer support.
            We believe in innovation, teamwork, and continuous improvement to meet the needs of our growing community. 
          </p>
          <p>
            We value integrity, transparency, and dedication, making us a trusted partner for all your needs. Join us on our journey as we aim to make a difference.
          </p>
          <br />
          <h2>Khoa</h2>
        </div>
        <div className="aboutus-photo">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTigq6uJh5hME3jnf0MNd8Y6EENCGBS4gfYjQ&s"
            alt="Our Team"
            className="photo"
          />
        </div>
      </div>
      <div className="aboutus-footer">
        <h3>Thank you for visiting!</h3>
      </div>
      <Footer />
    </div>
  );
};

export default Aboutus;
