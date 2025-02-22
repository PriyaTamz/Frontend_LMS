import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import Rating from './Rating';
import './Home.css';

const EducationBooks = () => {
    const [educationBooks, setEducationBooks] = useState([]);
    const [visibleEducationBooks, setVisibleEducationBooks] = useState(3); 
    const booksPerRow = 3.5; 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEducationBooks = async () => {
            try {
                const books = await authServices.getAllBooks(); // Ensure `getAllBooks` returns the books array
    
                if (Array.isArray(books)) { // Ensure the response is an array
                    const filteredBooks = books.filter(book => book.genre === 'Education'); // Filter education books
    
                    const updatedBooks = filteredBooks.map(book => {
                        if (book.reviews && book.reviews.length > 0) {
                            const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
                            const averageRating = totalRating / book.reviews.length;
                            return { ...book, rating: averageRating };
                        }
                        return { ...book, rating: 0 };
                    });
    
                    setEducationBooks(updatedBooks);
                } else {
                    console.warn("Books data is not an array:", books);
                }
            } catch (error) {
                console.error("Error fetching education books:", error);
            }
        };
    
        fetchEducationBooks(); // Fetch education books on component mount
    }, []);    
   
    const handlePreview = (bookId) => {
        navigate(`/books/details/${bookId}`);
    };

  
    const handleViewMore = () => {
        setVisibleEducationBooks(prevVisibleBooks => prevVisibleBooks + booksPerRow);
    };

    return (
        <div>
            <div className="header">
                <h2>Education Books</h2>
            </div>
            <div className="book-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {educationBooks.slice(0, visibleEducationBooks * booksPerRow).map(book => (
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

           
            {visibleEducationBooks * booksPerRow < educationBooks.length && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="btn btn-link" onClick={handleViewMore}>
                        View More
                    </button>
                </div>
            )}

            <footer style={{ marginTop: '50px', textAlign: 'center' }}>
                <p>Open Library &copy; 2024</p>
            </footer>
        </div>
    );
};

export default EducationBooks;
