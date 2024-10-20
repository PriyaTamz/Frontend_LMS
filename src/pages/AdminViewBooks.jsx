import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import Rating from './Rating';
import './AdminViewBooks.css';


const AdminViewBooks = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]); 
  const [reviewsLoading, setReviewsLoading] = useState(true); 
  const [reviewsError, setReviewsError] = useState(''); 

  useEffect(() => {
    console.log('bookId:', bookId);

    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated');
            }

        const bookDetails = await authServices.getBookByIdAuthenticated(bookId, token);
      
        if (bookDetails.reviews && bookDetails.reviews.length > 0) {
          const totalRating = bookDetails.reviews.reduce((acc, review) => acc + review.rating, 0);
          bookDetails.rating = totalRating / bookDetails.reviews.length;
        } else {
          bookDetails.rating = 0; 
        }

        setBook(bookDetails);  
      } catch (err) {
        setError('Error fetching book details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => { 
      try {
        const response = await authServices.getReviews(bookId);
        setReviews(response.data);
        setReviewsLoading(false);
      } catch (err) {
        setReviewsError('Failed to load reviews');
        setReviewsLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
      fetchReviews(); 
    } else {
      setError('Invalid book ID');
    }
  }, [bookId]);

  const handleToggleAvailability = async (isAvailable) => {
    try {
      const response = await authServices.markAsAvailable(bookId, { isAvailable: !isAvailable });
      setBook((prevBook) => ({ ...prevBook, isAvailable: response.data.book.isAvailable }));
    } catch (error) {
      setError('Failed to update book availability');
    }
  };

  const handleDeleteReview = async (reviewId) => { 
    try {
      await authServices.deleteReview(bookId, reviewId);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId)); 
    } catch (err) {
      setReviewsError('Failed to delete review');
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <button onClick={() => navigate(-1)} className="btn btn-primary">Back</button> 
      <h2 className='book-title'>{book.title || 'Untitled'}</h2>
      <div className="book-preview">
        <img
          src={book.imageUrl || 'https://via.placeholder.com/150'}
          alt={book.title}
          className="preview-image"
        />
        <div className="book-info">
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>ISBN:</strong> {book.ISBN}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Subcategory:</strong> {book.subcategory}</p>
          <p><strong>Publication Year:</strong> {book.publication_year}</p>
          <p><strong>Available:</strong> {book.isAvailable ? 'Yes' : 'No'}</p>
          <button
            type="button"
            className={`btn ${book.isAvailable ? 'btn-success' : 'btn-danger'}`}
            onClick={() => handleToggleAvailability(book.isAvailable)}
          >
            {book.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
          </button>
        </div>
      </div>

     
      <div className="book-reviews">
        <h3>Reviews</h3>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : reviewsError ? (
          <p>{reviewsError}</p>
        ) : reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review._id}>
                <p><strong>{review.userId ? review.userId.name : 'Anonymous'}:</strong> {review.content}</p>
                <Rating rating={book.rating || 0} />
                <p>Review: {review.review}</p>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="btn btn-danger"
                >
                  Delete Review
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available for this book.</p>
        )}
      </div>
    </div>
  );
};

export default AdminViewBooks;
