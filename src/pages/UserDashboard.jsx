// UserDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import UserDashboardNav from '../wrappers/UserDashboardNav';
import GenreNav from './GenreNav'; 
import Rating from './Rating';
import SearchBar from './SearchBar';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]); 
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [searchOption, setSearchOption] = useState('title'); 
    const [visibleBooks, setVisibleBooks] = useState(8); 
    const booksPerRow = 5; 

    const fetchUserProfileAndBooks = async () => {
        try {
            const profileResponse = await authServices.getUserProfile();
            if (profileResponse.data && profileResponse.data.user) {
                setUserName(profileResponse.data.user.name);
            } else {
                throw new Error('User profile is missing');
            }

            const booksResponse = await authServices.viewAllBooks();
        
            const updatedBooks = booksResponse.data.map(book => {
                if (book.reviews && book.reviews.length > 0) {
                    const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
                    const averageRating = totalRating / book.reviews.length;
                    return { ...book, rating: averageRating }; 
                }
                return { ...book, rating: 0 }; 
            });

            
            const borrowedBooks = updatedBooks.filter(book => book.borrowedBy?._id === currentUserId);
            const reservedBooks = updatedBooks.filter(book => book.reservedBy?.includes(currentUserId));
            const availableBooks = updatedBooks.filter(book => !book.borrowedBy && !book.reservedBy?.includes(currentUserId));

            
            const orderedBooks = [...borrowedBooks, ...reservedBooks, ...availableBooks];

            setBooks(orderedBooks);
            setFilteredBooks(orderedBooks);

            const notificationsResponse = await authServices.getUserNotifications();
            if (notificationsResponse.data.success && notificationsResponse.data.notifications.length > 0) {
                setNotifications(notificationsResponse.data.notifications);
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

    const handleSearch = () => {
        let filtered = books;
        if (searchOption === 'title') {
            filtered = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
        } else if (searchOption === 'author') {
            filtered = books.filter(book => book.author.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredBooks(filtered);
        setSearchTerm('');
    };

    const handleBorrowBook = async (bookId) => {

        try {
            await authServices.borrowBook(bookId);
            alert('Book borrowed successfully!');
            await fetchUserProfileAndBooks();
        } catch (error) {
            console.error("Error borrowing book:", error.response ? error.response.data : error.message);
            alert('Failed to borrow the book.');

        }
    };


    const handleReturnBook = async (bookId, borrowedById) => {
        try {
            if (borrowedById === currentUserId) {
                await authServices.returnBook(bookId);
                alert('Book returned successfully!');
    
                navigate(`/submit-review/${bookId}`);
                await fetchUserProfileAndBooks();
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
                const dueDate = new Date(reserveResponse.data.book.dueDate).toLocaleDateString(); 
                const userConfirmed = window.confirm(`The book "${reserveResponse.data.book.title}" is now available. Due date: ${dueDate}. Would you like to borrow it?`);

                if (userConfirmed) {
                
                    await authServices.confirmBorrowBook(bookId);
                    alert('Book borrowed successfully!');
                    await fetchUserProfileAndBooks();
                }
            }

            await fetchUserProfileAndBooks();
        } catch (error) {
            console.error("Error reserving book:", error);
            alert('Failed to reserve the book.');
        }
    };

    const handleViewMore = () => {
        setVisibleBooks(prevVisibleBooks => prevVisibleBooks + booksPerRow);
    };

    const handleviewBook = async (bookId) => {
        navigate(`/books/auth/details/${bookId}`);
    }

    const handleMarkAsRead = async (notificationId) => {
        try {
            await authServices.markAsRead(notificationId);

            
            setNotifications((prevNotifications) =>
                prevNotifications.filter(notification => notification._id !== notificationId)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            alert('Failed to mark the notification as read.');
        }
    };

    const handleSelectGenre = (genre) => {
        if (genre === 'all') {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(books.filter(book => book.genre.toLowerCase() === genre));
        }
    };


    const renderNotifications = () => {
        if (notifications.length === 0) {
            return <p>No notifications available.</p>;
        }

        return notifications.map((notification) => (
            <div key={notification._id} className={`alert ${notification.isRead ? 'alert-secondary' : 'alert-info'}`}>
                {notification.message}
                {!notification.isRead && (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleMarkAsRead(notification._id)}
                    >
                        Mark as Read
                    </button>
                )}
            </div>
        ));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-dashboard">
            <UserDashboardNav />
            <h1 className='name'>Welcome, {userName}!</h1>

            <div>
                <div className="search-section">
                    <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)} className="search-select">
                        <option value="all">Search by All</option>
                        <option value="title">Search by Title</option>
                        <option value="author">Search by Author</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search books"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-btn">Search</button>

                
                </div>

            
                <div className="notifications">
                    <h3>Your Notifications</h3>
                    {renderNotifications()}
                </div>
            </div>

            <div className="dashboard-content">
                <GenreNav onSelectGenre={handleSelectGenre} />

                <div className="book-list">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.slice(0, visibleBooks).map(book => (
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
                                        className="btn btn-link"
                                        onClick={() => handleviewBook(book._id)}
                                    >
                                        View Book
                                    </button>

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
                                                Borrow Book
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

            {visibleBooks < filteredBooks.length && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="btn btn-link" onClick={handleViewMore}>
                        View More
                    </button>
                </div>
            )}

        </div>
    );
};

export default UserDashboard;