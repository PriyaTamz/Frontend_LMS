import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices'; 
import UserDashboardNav from '../wrappers/UserDashboardNav';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    const fetchUserProfileAndBooks = async () => {
        try {
            const profileResponse = await authServices.getUserProfile();
            if (profileResponse.data && profileResponse.data.user) {
                setUserName(profileResponse.data.user.name);
            } else {
                throw new Error('User profile is missing');
            }

            const booksResponse = await authServices.viewAllBooks();
            setBooks(booksResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            navigate('/user-login'); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/user-login'); 
            return;
        }

        fetchUserProfileAndBooks();
    }, [isLoggedIn, navigate]);

    const handleBorrowOrReturnBook = async (bookId, isAvailable, borrowedById) => {
        try {
            if (isAvailable) {
                await authServices.borrowBook(bookId);
                alert('Book borrowed successfully!');
            } else {
                if (borrowedById === currentUserId) {
                    await authServices.returnBook(bookId);
                    alert('Book returned successfully!');
                    navigate(`/submit-review/${bookId}`);
                } else {
                    alert('You cannot return this book as it is borrowed by another user.');
                }
            }
           
            await fetchUserProfileAndBooks(); 
        } catch (error) {
            console.error("Error processing book action:", error);
            alert(`Failed to ${isAvailable ? 'borrow' : 'return'} the book.`);
        }
    };

    const handleReserveBook = async (bookId) => {
        try {
            await authServices.reserveBook(bookId);
            alert('Book reserved successfully!');
            await fetchUserProfileAndBooks(); 
        } catch (error) {
            console.error("Error reserving book:", error);
            alert('Failed to reserve the book.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-dashboard">
            <UserDashboardNav />
            <h1 className='name'>Welcome, {userName}!</h1>
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
                                <p className="card-text">Borrowed By: {book.borrowedBy ? book.borrowedBy.name : 'Available'}</p>

                                
                                {book.isAvailable ? (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => handleBorrowOrReturnBook(book._id, true)}
                                    >
                                        Borrow
                                    </button>
                                ) : book.borrowedBy?._id === currentUserId ? (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => handleBorrowOrReturnBook(book._id, false, book.borrowedBy._id)}
                                    >
                                        Return Book
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={`btn ${book.reservedBy?.includes(currentUserId) ? 'btn-secondary' : 'btn-danger'}`}
                                            onClick={() => handleReserveBook(book._id)}
                                            disabled={book.reservedBy?.includes(currentUserId)} 
                                        >
                                            {book.reservedBy?.includes(currentUserId) ? 'Reserved' : 'Reserve Book'}
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books available</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
