import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { books = [], searchTerm = '' } = location.state || {};

  const filteredBooks = books.filter((book) => 
    searchTerm ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  if (filteredBooks.length === 0) {
    return <div className="alert alert-warning">No books found matching your search criteria.</div>;
  }

  return (
    <div>
      <h2>Search Results for "{searchTerm}"</h2>
      <div className="book-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredBooks.map((book) => (
          <div key={book._id} className="card" style={{ width: '18rem' }}>
            <img
              src={book.imageUrl || 'https://via.placeholder.com/150'}
              className="card-img-top"
              alt={book.title || 'Book Image'}
            />
            <div className="card-body">
              <h5 className="card-title">{book.title || 'Untitled'}</h5>
              <p className="card-text">Author: {book.author}</p>
              <p className="card-text">Genre: {book.genre}</p>
              <button
                type="button"
                className="btn btn-link"
                style={{ marginTop: '10px' }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
