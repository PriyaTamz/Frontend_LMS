import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Rating from './Rating';

const SearchResults = () => {
  const location = useLocation();
  const { books = [], searchTerm = '' } = location.state || {};
  const navigate = useNavigate();


  const filteredBooks = books.filter((book) =>
    searchTerm ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  if (filteredBooks.length === 0) {
    return <div className="alert alert-warning">No books found matching your search criteria.</div>;
  }

  const handlePreview = (bookId) => {
    navigate(`/books/details/${bookId}`);
  };

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
             
              <Rating rating={book.rating || 0} />
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handlePreview(book._id)}
                style={{ marginTop: '10px' }}
              >
                Want to Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
