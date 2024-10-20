import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import Rating from './Rating';
import './ViewBookUser.css';

const ViewBookUser = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchBookDetails = async () => {
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
            console.error('Error fetching book details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookId) {
            fetchBookDetails();
        }
    }, [bookId]);

    if (loading) {
        return <p>Loading book details...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!book) {
        return <p>No book details available.</p>;
    }

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="book-details">
            <button onClick={handleBack} className="back-button">Back</button>
            <h2><strong>{book.title}</strong></h2>
            <img
                src={book.imageUrl || 'https://via.placeholder.com/150'}
                alt={book.title}
                className="preview-image"
            />
            <Rating rating={book.rating || 0} />
            <button className='download-pdf'>Download PDF</button>

            <h4 className='book-info'>Book information</h4>
            <div className='para'>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>ISBN:</strong> {book.ISBN}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Subcategory:</strong> {book.subcategory}</p>
                <p><strong>Publication Year:</strong> {book.publication_year}</p>
                <p><strong>Available:</strong> {book.available ? 'Yes' : 'No'}</p>
            </div>

            <div>
                {book.reviews && book.reviews.length > 0 && (
                    <div>
                        <h4 className='rev-title'>Reviews</h4>
                        {book.reviews.map((review, index) => (
                            <div key={index} className="review">
                                <p>
                                    <strong>{review.userId ? review.userId.name : 'Anonymous'}:</strong> {review.review}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBookUser;
