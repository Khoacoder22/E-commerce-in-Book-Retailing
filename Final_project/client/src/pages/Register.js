import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';  // Import toast
import 'react-toastify/dist/ReactToastify.css';  // Import CSS cho toast

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFinish = (event) => {
    event.preventDefault();
    const values = {
      username: event.target.username.value.trim(),
      password: event.target.password.value.trim(),
      verifyPassword: event.target.verifyPassword.value.trim(),
      email: event.target.email.value.trim(),
    };

    if (values.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (values.password !== values.verifyPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      register(values);
      toast.success('Registration successful!');  
      if (location.state?.from === 'cart') {
        navigate('/shop');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Error during registration. Try again.');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', padding: '20px', marginLeft: '50px', color: 'white' }}>Sign Up</h1>
      <div className="form-box">
        <div className="register-container" id="register">
          <form className='top' onSubmit={handleFinish}>
            <div className="input-box">
              <input type="text" name="username" className="input-field" placeholder='Name' required />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" className="input-field" placeholder='Password' required />
              <i className="bx bx-lock"></i>
            </div>
            <div className="input-box">
              <input type="password" name="verifyPassword" className="input-field" placeholder='Verify Password' required />
              <i className="bx bx-lock"></i>
            </div>
            <div className="input-box">
              <input type="email" name="email" className="input-field" placeholder='Email' required />
              <i className="bx bx-envelope"></i>
            </div>
            <br />
            <button className="button" type="submit">Send</button>
          </form>
        </div>
      </div>
      <ToastContainer /> 
    </>
  );
};
