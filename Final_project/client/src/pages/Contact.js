import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './Contact.css';
import emailjs from 'emailjs-com';
import Footer from '../component/footer'; 

const Contact = () => {
  const [message, setMessage] = useState('');
  const serviceid = "service_dh8ug5c";   
  const templateid = "template_mmpsb0u"; 
  const publickey = "LXT1hW9uO_0s0BvQs"; 

  const handleFinish = (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.username.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    const storedData = JSON.parse(localStorage.getItem('contactFormData')) || [];
    const updatedData = [...storedData, formData];
    localStorage.setItem('contactFormData', JSON.stringify(updatedData));

    emailjs.sendForm(serviceid, templateid, e.target, publickey)
      .then((result) => {
        toast.success('Email sent successfully!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, (error) => {
        toast.error('Failed to send email. Please try again later.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error('Error sending email:', error);
      });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '20px', marginLeft: '50px', color: 'white'}}>Contact</h1>
      <div className="form-box" style={{width:'100%'}}>
        <div className="contact-container" id="register">
          <form className="top" onSubmit={handleFinish}>
            <div className="input-box">
              <input type="text" name="username" className="input-field" placeholder="Name" required />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input type="email" name="email" className="input-field" placeholder="Email" required/>
              <i className="bx bx-lock"></i>
            </div>
            <div className="input-box" >
              <textarea 
                name="message" 
                className="input-field" 
                placeholder="Your opinion" 
                required 
                value={message} 
                style={{height:"100px"}}
                onChange={(e) => setMessage(e.target.value)} 
              />
              <i className="bx bx-lock"></i>
            </div>
            <br />
            <button className="button" type="submit">Submit</button>
          </form>
        </div>
      </div>
      <ToastContainer />
      <br></br>
      <br></br>
      <Footer></Footer>
    </div>
  );
};

export default Contact;
