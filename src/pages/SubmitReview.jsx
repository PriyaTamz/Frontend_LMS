import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authServices from '../services/authServices';

const SubmitReview = () => {
    const { bookId } = useParams();
    console.log(bookId);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const navigate = useNavigate();

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                review: reviewText,
                rating,
            };
            
            await authServices.submitReview(bookId, reviewData);
            alert('Review submitted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit the review.');
        }
    };

    return (
        <div className="submit-review-page">
            <h2 className='title'>Submit Review for Book</h2>
            <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                    <label htmlFor="review">Your Review:</label>
                    <textarea
                        id="review"
                        className="form-control"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        className="form-control"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    >
                        {[1, 2, 3, 4, 5].map((rate) => (
                            <option key={rate} value={rate}>{rate}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
        </div>
    );
};

export default SubmitReview;
