import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import './Home.css'; 

const Home = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        
        authServices.getAllBooks()
            .then(response => {
                setBooks(response.data); 
            })
            .catch(error => {
                console.error("Error fetching books:", error);
            });
    }, []);

  
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

   
    const handleViewReviews = (bookId) => {
        navigate(`/books/${bookId}/reviews`);
    };

    return (
        <div>
            <div className="header">
                <h2>Welcome to Open Library</h2>
            </div>
            <div className="header">
                <h5> Available Books</h5>
            </div>
            <div className="book-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {books.length > 0 ? (
                    books.map(book => (
                        <div key={book._id} className="card" style={{ width: '18rem' }}>
                            <img
                                src={book.imageUrl || 'https://via.placeholder.com/150'}
                                className="card-img-top"
                                alt={book.title || 'Book Image'}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{book.title || 'Untitled'}</h5>
                                <p className="card-text">Author: {book.author}</p>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => handleViewReviews(book._id)}
                                    style={{ marginTop: '10px' }}
                                >
                                    View Reviews
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${book.isAvailable ? 'btn btn-success' : 'btn btn-secondary'}`}
                                    onClick={() => handleBookAction(book.isAvailable)}
                                >
                                    {book.isAvailable ? 'Borrow' : 'Checkout'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books available</p>
                )}
            </div>
            <footer style={{ marginTop: '50px', textAlign: 'center' }}>
                <p>Open Library &copy; 2024</p>
            </footer>
        </div>
    );
};

export default Home;
