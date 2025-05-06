import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import Link from '../Link/Link';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';

import './index.scss';

interface SearchItemProps {
  item: {
    url: string;
    title?: string;
    bodyExcerpt?: string;
    body_excerpt?: string;
  };
}

interface SearchEngineProps {
  searchEngineVisible: boolean;
  setSearchEngineVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchEngine({ searchEngineVisible, setSearchEngineVisible }: SearchEngineProps) {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchItemProps['item'][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={`search-engine ${searchEngineVisible ? 'search-engine--visible' : ''}`}>
      <div className="search-engine__close-icon" onClick={() => setSearchEngineVisible((prev) => !prev)}>
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
          onSubmit={async (e: FormEvent) => {
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

const SearchItem: React.FC<SearchItemProps> = ({ item }) => {
  return (
    <li className="search-engine__results-item">
      <Link to={item.url}>
        <h6>{item.title || 'N/A'}</h6>
        <p>{item.bodyExcerpt || item.body_excerpt}</p>
      </Link>
    </li>
  );
};
