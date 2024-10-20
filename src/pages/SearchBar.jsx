
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOption, setSearchOption] = useState('all');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ searchTerm, searchOption });
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <label htmlFor="search">Search Books: </label>
            <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term"
            />
            <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                <option value="all">All</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
            </select>
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
