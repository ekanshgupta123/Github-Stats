import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GithubStats from './GithubStats';
import SearchBar from './SearchBar';
import RepositoryList from './RepositoryList';
import './css/App.css';

function App() {
  const [username, setUsername] = useState('');

  const handleSearch = (searchTerm) => {
    setUsername(searchTerm);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <SearchBar onSearch={handleSearch} />
        </header>
        <Routes>
          <Route
            path="/"
            element={username ? <GithubStats username={username} /> : null}
          />
          <Route
            path="/repositories"
            element={<RepositoryList username={username} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
