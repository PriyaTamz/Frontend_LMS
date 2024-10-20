import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';

const BookDetails = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const currentUserId = localStorage.getItem('userId');

    const fetchBookDetails = async () => {
        try {
            const response = await authServices.getBookById(bookId);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const notificationsResponse = await authServices.getUserNotifications();
            if (notificationsResponse.data.success && notificationsResponse.data.notifications.length > 0) {
                setNotifications(notificationsResponse.data.notifications);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchBookDetails();
        fetchNotifications();
    }, [bookId]);

    const handleBorrowBook = async () => {
        try {
            await authServices.borrowBook(bookId);
            alert('Book borrowed successfully!');
            fetchBookDetails();
        } catch (error) {
            console.error("Error borrowing book:", error);
            alert('Failed to borrow the book.');
        }
    };

    const handleReturnBook = async () => {
        try {
            await authServices.returnBook(bookId);
            alert('Book returned successfully!');
            navigate(`/submit-review/${bookId}`);
            fetchBookDetails();
        } catch (error) {
            console.error("Error returning book:", error);
            alert('Failed to return the book.');
        }
    };

    const handleReserveBook = async () => {
        try {
            const reserveResponse = await authServices.reserveBook(bookId);
            alert('Book reserved successfully!');
            fetchBookDetails();
        } catch (error) {
            console.error("Error reserving book:", error);
            alert('Failed to reserve the book.');
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await authServices.markAsRead(notificationId);
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification._id !== notificationId)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className="book-details">
            {book ? (
                <>
                    <h1>{book.title}</h1>
                    <p>Author: {book.author}</p>
                    <p>ISBN: {book.isbn}</p>
                    <p>Available: {book.isAvailable ? 'Yes' : 'No'}</p>
                   
                    {book.isAvailable ? (
                        <button onClick={handleBorrowBook} className="btn btn-success">Borrow</button>
                    ) : book.borrowedBy === currentUserId ? (
                        <button onClick={handleReturnBook} className="btn btn-warning">Return</button>
                    ) : (
                        <button onClick={handleReserveBook} className="btn btn-danger">Reserve</button>
                    )}

                
                    <div className="notifications">
                        <h3>Your Notifications</h3>
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification._id} className="notification">
                                    <p>{notification.message}</p>
                                    {!notification.isRead && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleMarkAsRead(notification._id)}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No notifications available.</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading book details...</p>
            )}
        </div>
    );
};

export default BookDetails;
