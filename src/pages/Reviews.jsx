import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import './Reviews.css';

const Reviews = () => {
    const { bookId } = useParams();
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        authServices.getReviews(bookId)
            .then(response => {
                setReviews(response.data);
                console.log(response.data); 
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
    }, [bookId]);

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="reviews-container">
            <button
                onClick={handleBackClick}
                className="back-button"
            >
                Back
            </button>
            <h2>Book Reviews</h2>
            {reviews.length > 0 ? (
                <ul className="reviews-list">
                    {reviews.map((review, index) => (
                        <li key={index} className="review-item">
                            <p><strong>{review.userId ? review.userId.name : 'Anonymous'}:</strong></p>
                            <p>Review: {review.review}</p>
                            <p className="review-rating">Rating: {review.rating}/5</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews available for this book.</p>
            )}
        </div>
    );
};

export default Reviews;

