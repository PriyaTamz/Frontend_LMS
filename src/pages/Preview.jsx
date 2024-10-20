import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import Rating from './Rating';
import './Preview.css';

const Preview = () => {
    const { bookId } = useParams();  
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
       
        authServices.getBookById(bookId)
            .then(response => {
                const fetchedBook = response;
                const updatedBook = calculateAverageRating(fetchedBook);
                setBook(updatedBook); 
                console.log(updatedBook);
            })
            .catch(error => {
                console.error("Error fetching book details:", error);
            });
    }, [bookId]);

    const calculateAverageRating = (book) => {
        if (book.reviews && book.reviews.length > 0) {
            console.log(book.reviews); 

            const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / book.reviews.length;
            return { ...book, rating: averageRating }; 
        }
        return { ...book, rating: 0 };
    };

    if (!book) {
        return <p>Loading book details...</p>;
    }

    /*const handleViewReviews = (bookId) => {
        navigate(`/books/${bookId}/reviews`);
    };*/

    const handleBookAction = (isAvailable) => {
        const token = localStorage.getItem('token');
        if (!token) {

            navigate('/user-login');
        } else {
            if (isAvailable) {

                alert("Book borrowed successfully!");
            } else {

                alert("Book checked out!");
            }
        }
    };

   
    const handleBack = () => {
        navigate(-1); 
    };

    return (
        <div className="preview-container">
            <button onClick={handleBack} className="back-button">Back</button>
            <div className="book-preview">
                <img
                    src={book.imageUrl || 'https://via.placeholder.com/150'}
                    alt={book.title}
                    className="preview-image"
                />
                <div className="book-info">
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>ISBN:</strong> {book.ISBN}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Subcategory:</strong> {book.subcategory}</p>
                    <p><strong>Publication Year:</strong> {book.publication_year}</p>
                    <p><strong>Available:</strong> {book.isAvailable ? 'Yes' : 'No'}</p>
                </div>
            </div>
            <Rating rating={book.rating || 0} />
            <button
                type="button"
                className={`btn ${book.isAvailable ? 'btn btn-success' : 'btn btn-secondary'}`}
                onClick={() => handleBookAction(book.isAvailable)}
            >
                {book.isAvailable ? 'Borrow' : 'Checkout'}
            </button>

            <div className="book-reviews">
                <h3>Reviews</h3>
                {book.reviews && book.reviews.length > 0 ? (
                    <ul>
                        {book.reviews.map((review, index) => (
                            <li key={index}>
                                <p><strong>{review.userId.name}:</strong> {review.review}</p>
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

export default Preview;
