import React, { useState } from 'react';
import './css/Search.css';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(searchTerm);
    };
  
    return (
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          className="searchTerm"
          placeholder="Enter the Github Username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="searchButton">
          <p className="fa fa-search">Submit</p>
        </button>
      </form>
    );
  };
  
  export default SearchBar;