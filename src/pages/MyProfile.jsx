import React, { useState, useEffect } from 'react';
import authServices from '../services/authServices';
import { useNavigate } from 'react-router-dom'; 
import './MyProfile.css';


const MyProfile = () => {
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        booksBorrowed: [],
        reservedBooks: [],
        overdueNotifications: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const navigate = useNavigate(); 

    useEffect(() => {
      
        authServices.getUserProfile()
            .then(response => {
                const { user, booksBorrowed, reservedBooks, overdueNotifications } = response.data;
                setUserProfile({ ...user, booksBorrowed, reservedBooks, overdueNotifications });
                setFormData({ name: user.name, email: user.email });
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: userProfile.name,
            email: userProfile.email
        });
    };

    const handleSave = async () => {
        try {
            await authServices.updateUserProfile(formData);
            setUserProfile({ ...userProfile, ...formData });
            setIsEditing(false);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleBack = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="my-profile">
            <button onClick={handleBack} className="back-button">Back</button>

            <div className="profile-section">
                <label>Name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{userProfile.name}</p>
                )}
            </div>

            <div className="profile-section">
                <label>Email:</label>
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{userProfile.email}</p>
                )}
            </div>

            <div className="profile-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="save-button">Save</button>
                        <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </>
                ) : (
                    <button onClick={handleEdit} className="edit-button">Edit Profile</button>
                )}
            </div>

            <div className="history-section">
                <h3>Borrowing History</h3>
                {userProfile.booksBorrowed.length > 0 ? (
                    <ul>
                        {userProfile.booksBorrowed.map((book, index) => (
                            <li key={index}>
                                <strong>{book.bookTitle}</strong> -
                                Borrowed on: {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : 'N/A'} -
                                Due: {new Date(book.dueDate).toLocaleDateString()}
                                {book.returnDate ? `, Returned: ${new Date(book.returnDate).toLocaleDateString()}` : ''}
                                {book.lateFee ? `, Late Fee: $${book.lateFee}` : ''}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No borrowed books.</p>
                )}
            </div>

            <div className="history-section">
                <h3>Reserved Books</h3>
                {userProfile.reservedBooks.length > 0 ? (
                    <ul>
                        {userProfile.reservedBooks.map((book, index) => (
                            <li key={index}>
                                <strong>{book.title}</strong> -
                                Reserved on: {book.reservedDate ? new Date(book.reservedDate).toLocaleDateString() : 'N/A'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reserved books.</p>
                )}
            </div>

            <h3>Overdue Notifications</h3>
            {userProfile.overdueNotifications.length > 0 ? (
                <div className="history-section">
                    <ul>
                        {userProfile.overdueNotifications.map((notification, index) => (
                            <li key={index}>
                                <strong>{notification.bookTitle}</strong> - Due: {new Date(notification.dueDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No overdue notifications.</p> 
            )}

        </div>
    );
};

export default MyProfile;
