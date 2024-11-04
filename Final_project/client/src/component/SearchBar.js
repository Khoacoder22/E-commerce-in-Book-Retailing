import React, { useState } from 'react';
import './SearchBar.css'; 

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery); 
    }
  };

  return (
    <form className='search-form' onSubmit={handleSearch}>
      <div className='input-container'>
        <input 
          type="search" 
          placeholder='Type here...' 
          className='search-input'
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className='search-button' type="submit">
          <label>Search</label>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
