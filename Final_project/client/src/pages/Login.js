import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './Register.css';  
import { FaUserAstronaut } from "react-icons/fa6";
import { MdOutlinePassword } from "react-icons/md";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const isSuccess = await login({ username, password }); // Sử dụng await để chờ kết quả từ login
      if (isSuccess) {
        navigate('/');  
      } else {
        toast.error('Invalid user or password', { 
          position: "top-right", 
          autoClose: 3000, 
        });
      }
    } catch (error) {
      toast.error('An error occurred during login', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', padding: '20px', marginLeft: '50px', color: 'white' }}>Login</h1>
      <div className="form-box">
        <div className="register-container" id="register">
          <form className='top' onSubmit={handleLogin}>
            <div className="input-box">
              <p style={{color:'white', marginLeft:'15px'}}><FaUserAstronaut /> User Name</p>
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-box">
              <p  style={{color:'white', marginLeft:'15px'}}><MdOutlinePassword /> Password</p>
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <br />
            <button className="button" type="submit">Login</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
