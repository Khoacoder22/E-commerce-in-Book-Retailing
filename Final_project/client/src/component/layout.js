import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';
import Support from '../pages/Support'; 

const Layout = ({ children }) => {
  const { isAuthenticated, isAdmin, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/home');
  };

  return (
    <div className="banner">
      <div className="navbar">
        <img
          src="https://www.loc.gov/static/images/logo-loc-new-branding.svg"
          className="logo"
          alt="Logo"
        />
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/Contact">Contact us</Link></li>
          <li><Link to="/About">About us</Link></li>
        </ul>

        {isAuthenticated ? (
          <>
            <ul>
              <li><Link to="/Checkout">Hi {username}</Link></li>
              <li>
                <Link to="/home" onClick={handleLogoutClick}>Log out</Link>
              </li>
              <li>
                <Link to="/Orders">My Order</Link>
              </li>
            </ul>

            {isAdmin && (
              <div className="dropdown">
                <button className="dropbtn">Admin</button>
                <div className="dropdown-content">
                  <Link to="/Orders">Order</Link>
                  <Link to="/AdminGetInformation">Contact storage</Link>
                  <Link to="/Productlist">Product List</Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <ul>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </>
        )}
      </div>

      {children}

      {/* Thêm chatbot vào giao diện */}
      <Support />
    </div>
  );
};

export default Layout;
