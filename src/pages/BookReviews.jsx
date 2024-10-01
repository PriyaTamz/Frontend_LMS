import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices'; 
import './BookReviews.css';

const BookReviews = () => {
    const { bookId } = useParams(); 
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
       
        const fetchReviews = async () => {
            try {
                const response = await authServices.getReviews(bookId); 
                setReviews(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load reviews');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId]);

    const handleDeleteReview = async (reviewId) => {
        try {
            await authServices.deleteReview(bookId, reviewId);
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            setError('Failed to delete review');
        }
    };

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="book-reviews">
            <button onClick={() => navigate(-1)} className="btn btn-primary">Back</button>
            <h2 className='text'>Reviews for Book ID: {bookId}</h2>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id}>
                            <p><strong>{review.userId ? review.userId.name : 'Anonymous'}:</strong>{review.content}</p>
                            <p>Review: {review.review}</p>
                            <p>Rating: {review.rating}/5</p>
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
    );
};

export default BookReviews;
