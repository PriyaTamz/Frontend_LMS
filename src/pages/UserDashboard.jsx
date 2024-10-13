import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import UserDashboardNav from '../wrappers/UserDashboardNav';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [books, setBooks] = useState([]);
    const [notifications, setNotifications] = useState(null);
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

            
            const notificationsResponse = await authServices.getUserNotifications();
            
            if (notificationsResponse.success && notificationsResponse.notifications.length > 0) {
                setNotifications(notificationsResponse.notifications); 
            } else {
                setNotifications([]); 
            }

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

    const handleBorrowBook = async (bookId) => {
        try {
            await authServices.borrowBook(bookId);
            alert('Book borrowed successfully!');
            await fetchUserProfileAndBooks();
        } catch (error) {
            console.error("Error borrowing book:", error);
            alert('Failed to borrow the book.');
        }
    };

    const handleReturnBook = async (bookId, borrowedById) => {
        try {
            if (borrowedById === currentUserId) {
                await authServices.returnBook(bookId);
                alert('Book returned successfully!');
                navigate(`/submit-review/${bookId}`);
            } else {
                alert('You cannot return this book as it is borrowed by another user.');
            }
            await fetchUserProfileAndBooks();
        } catch (error) {
            console.error("Error returning book:", error);
            alert('Failed to return the book.');
        }
    };

    const handleReserveBook = async (bookId) => {
        try {
            const reserveResponse = await authServices.reserveBook(bookId);
            alert('Book reserved successfully!');

          
            if (reserveResponse.data.book.isAvailable) {
                const userConfirmed = window.confirm(`The book "${reserveResponse.data.book.title}" is now available. Would you like to borrow it?`);

                if (userConfirmed) {
                    await handleBorrowBook(bookId); 
                }
            }

            await fetchUserProfileAndBooks(); 
        } catch (error) {
            console.error("Error reserving book:", error);
            alert('Failed to reserve the book.');
        }
    };


    const renderNotifications = () => {
        if (notifications.length === 0) {
            return <p>No notifications available.</p>;
        }

      
        const latestNotification = notifications[0];

        return (
            <div key={latestNotification._id} className="alert alert-info">
                {latestNotification.message}
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-dashboard">
            <UserDashboardNav />
            <h1 className='name'>Welcome, {userName}!</h1>

            {/* Notifications Section */}
            <div className="notifications">
                <h3>Your Notifications</h3>
                {notifications.length > 0 ? renderNotifications() : <p>No notifications available.</p>}
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
                                <p className="card-text">Borrowed By: {book.borrowedBy ? book.borrowedBy.name : 'Available'}</p>

                                {book.isAvailable ? (
                                   
                                    book.reservedBy?.includes(currentUserId) ? (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => handleBorrowBook(book._id)}
                                        >
                                            Borrow Book
                                        </button>
                                    ) : (
                                       
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => handleBorrowBook(book._id)}
                                        >
                                            Borrow
                                        </button>
                                    )
                                ) : book.borrowedBy?._id === currentUserId ? (
                                   
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => handleReturnBook(book._id, book.borrowedBy._id)}
                                    >
                                        Return Book
                                    </button>
                                ) : (
                                   
                                    <button
                                        type="button"
                                        className={`btn ${book.reservedBy?.includes(currentUserId) ? 'btn-secondary' : 'btn-danger'}`}
                                        onClick={() => handleReserveBook(book._id)}
                                        disabled={book.reservedBy?.includes(currentUserId)}
                                    >
                                        {book.reservedBy?.includes(currentUserId) ? 'Reserved' : 'Reserve Book'}
                                    </button>
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
