import React, { useEffect, useState } from 'react';
import Link from '../Link/Link';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';

import './index.scss';

export default function SearchEngine({ searchEngineVisible, setSearchEngineVisible }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  /*
  useEffect(() => {
    if (!searchEngineVisible) {
      setQuery('');
      setLoading(false);
      setResults(null);
      setError(false);
    }
  }, [searchEngineVisible]);

  const performSearch = async () => {
    try {
      setResults(null);
      setLoading(true);
      const response = await axios.post('/api/search-engine', { message: query });
      setResults(response.data?.items ?? []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };
  */

  return (
    <div className={`search-engine ${searchEngineVisible ? 'search-engine--visible' : ''}`}>
      <div className="search-engine__close-icon" onClick={() => setSearchEngineVisible((prev) => !prev)}>
        {/* Close icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M11.6667 11.6667L28.3334 28.3334M11.6667 28.3334L28.3334 11.6667"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="content">
        <label htmlFor="search-input">Search this website</label>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // await performSearch();
          }}
        >
          <input
            id="search-input"
            type="search"
            placeholder="ie: campaigns"
            value={query}
            onChange={handleInputChange}
            className={`${query ? 'with-value' : ''}`}
          />

          <button type="submit" className="btn-submit" />
        </form>

        {loading && (
          <div className="spinner">
            <Spinner />
          </div>
        )}

        {error && <p>Error! {error}</p>}

        {results !== null && results.length > 0 && (
          <div className="search-engine__results search-engine__results--active">
            <ul className="search-engine__results-list">
              {results.map((result, index) => (
                <SearchItem key={index} item={result} />
              ))}
            </ul>
          </div>
        )}

        {results !== null && results.length === 0 && query.length > 0 && (
          <p className="search-engine__message">Sorry, no results found. Try a different search</p>
        )}
      </div>
    </div>
  );
}

const SearchItem = ({ item }) => {
  return (
    <li className="search-engine__results-item">
      <Link to={item.url}>
        <h6>{item.title || 'N/A'}</h6>
        <p>{item.bodyExcerpt || item.body_excerpt}</p>
      </Link>
    </li>
  );
};
