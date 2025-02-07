import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import Rating from './Rating';
import './Home.css';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [visibleBooks, setVisibleBooks] = useState(3); 
    const booksPerRow = 3.5; 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const books = await authServices.getAllBooks(); // `getAllBooks` should return the books array
                const updatedBooks = books.map(book => {
                    // Compute average rating if reviews exist
                    if (book.reviews && book.reviews.length > 0) {
                        const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
                        const averageRating = totalRating / book.reviews.length;
                        return { ...book, rating: averageRating };
                    }
                    return { ...book, rating: 0 }; // Default rating to 0
                });
                setBooks(updatedBooks);
                setFilteredBooks(updatedBooks);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
    
        fetchBooks(); // Fetch books on component mount
    }, []);

    const handlePreview = (bookId) => {
        navigate(`/books/details/${bookId}`);
    };

    const handleViewMore = () => {
        setVisibleBooks(prevVisibleBooks => prevVisibleBooks + booksPerRow);
    };

    return (
        <div>
            <div className="header">
                <h2>Welcome to Open Library</h2>
            </div>
            <div className="book-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {filteredBooks.slice(0, visibleBooks * booksPerRow).map(book => (
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

            {visibleBooks * booksPerRow < filteredBooks.length && (
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

export default Home;
