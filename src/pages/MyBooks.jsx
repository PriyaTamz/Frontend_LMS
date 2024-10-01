import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authServices from '../services/authServices';
import './BorrowedBooks.css';

const BorrowedBooks = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await authServices.getBorrowedBooks();
            console.log(response.data);
            setTransactions(response.data); 
        } catch (err) {
            setError(err.message);
        }
    };

   
    const handleBack = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="container">
            <h1>My Borrowed Books</h1>
            <button onClick={handleBack} className="back-button">Back</button> 
            {error && <p className="error-message">{error}</p>}
            {transactions.length === 0 ? (
                <p className="no-books">No borrowed books found.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Late Fee</th>
                            <th>Reserved Book</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{transaction.bookId.title}</td>
                                <td>{new Date(transaction.borrowDate).toLocaleDateString()}</td>
                                <td>{new Date(transaction.dueDate).toLocaleDateString()}</td>
                                <td>{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : "Not Returned Yet"}</td>
                                <td>{transaction.lateFee}</td>
                                <td>{transaction.isReserved ? transaction.bookId.title : "Not Reserved"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BorrowedBooks;
