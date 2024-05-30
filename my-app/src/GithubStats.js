import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageBarChart from './LanguageBarChart';
import { Link } from 'react-router-dom';
import './css/App.css'; 

const GithubStats = ({ username }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
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
      fetchStats();
    }
  }, [username]);

  const renderLanguages = (languages) => {
    const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);

    const styles = {
      list: {
        listStyleType: 'none',
        padding: 0,
      },
    };

    return (
      <ul style={styles.list}>
        {sortedLanguages.map(([language, count], index) => (
          <li key={language}>{`${index + 1}. ${language}: ${count.toLocaleString()}`}</li>
        ))}
      </ul>
    );
  };

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
    <div className="App">
      <div className="container">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && stats && (
          <div className="stats-container">
            <div className="stats-column">
              <h3>User Github Stats:</h3>
              <Link to="/repositories" className="stats-block-link">
                <div className="stats-block">
                  <p className="stats-title">Total Repositories</p>
                  <p className="stats-value">{stats.total_repos}</p>
                </div>
              </Link>
                <div className="stats-block">
                  <p className="stats-title">Total Stars</p>
                  <p className="stats-value">{stats.total_stars}</p>
                </div>
                <div className="stats-block">
                  <p className="stats-title">Total Forks</p>
                  <p className="stats-value">{stats.total_forks}</p>
                </div>
                <div className="stats-block">
                  <p className="stats-title">Total Issues</p>
                  <p className="stats-value">{stats.total_issues}</p>
                </div>
            </div>
            <div className="languages-column">
              <h3>Languages Used:</h3>
              {renderLanguages(stats.languages)}
              <h3>Languages Distribution:</h3>
              <LanguageBarChart languages={stats.languages} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubStats;
