import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/App.css'; 

const RepositoryList = ({ username }) => {
  const [repositories, setRepositories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/github-repositories/${username}`);
        setRepositories(response.data);
      } catch (err) {
        console.error('Failed to fetch repositories', err);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/github-stats/${username}`);
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('User not found or API limit exceeded');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchRepositories();
      fetchStats();
    }
  }, [username]);

  const formatSize = (size) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} GB`;
    } else if (size >= 1024) {
      return `${(size / 1024).toFixed(2)} MB`;
    } else {
      return `${size} KB`;
    }
  };

  return (
    <div className="repository-list-container">
      <div className="repository-list">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <h3>All Repositories</h3>
        <ul className="no-bullets">
          {repositories.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {stats && (
        <div className="side-panel">
          <h3>Additional Stats</h3>
          <div className="stats-block">
            <p className="stats-title">Total Stargazers</p>
            <p className="stats-value">{stats.total_stargazers}</p>
          </div>
          <div className="stats-block">
            <p className="stats-title">Average Repo Size</p>
            <p className="stats-value">{formatSize(stats.average_size)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
