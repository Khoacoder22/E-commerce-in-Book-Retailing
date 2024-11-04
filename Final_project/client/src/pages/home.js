import React from 'react';
import { Link } from 'react-router-dom'; 
import './App.css';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../component/footer'; 
const Home = () => {
  const { isAuthenticated, isAdmin, username, logout } = useAuth();
  console.log(username);
  return (
    <div className="content">
      <h1>DESIGN YOUR MIND</h1>
      <p>Explore the knowledge</p>
      <div>
        <Link to="/register">
          <button type="button"><span></span>Join Us</button>
        </Link>
        <button type="button"><span></span>Explore</button>
      </div>
     
    </div>
  );
};

export default Home;
