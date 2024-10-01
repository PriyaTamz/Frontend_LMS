import React, { useEffect, useState } from 'react';
import authServices from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import './Reports.css'; 

const Reports = () => {
    const navigate = useNavigate();
    const [inventoryReport, setInventoryReport] = useState(null);
    const [borrowingStatistics, setBorrowingStatistics] = useState(null);
    const [userActivity, setUserActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const inventoryResponse = await authServices.getInventoryReport();
                setInventoryReport(inventoryResponse.data);

                const borrowingResponse = await authServices.getBorrowingStatistics();
                setBorrowingStatistics(borrowingResponse.data);

                const userActivityResponse = await authServices.getUserActivityReport();
                setUserActivity(userActivityResponse.data);
            } catch (err) {
                setError('Error fetching reports');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <p className="loading-message">Loading reports...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="reports-container">
            <button onClick={() => navigate('/admin-dashboard')} className="back-button">
                Back
            </button>
            <h2>Reports</h2>
            <h3>Inventory Report</h3>
            {inventoryReport && (
                <div>
                    <p>Total Books: {inventoryReport.totalBooks}</p>
                    <p>Available Books: {inventoryReport.availableBooks}</p>
                    <p>Reserved Books: {inventoryReport.reservedBooks}</p>
                    <h4>Books by Genre:</h4>
                    <ul>
                        {inventoryReport.booksByGenre.map((genre) => (
                            <li key={genre._id}>
                                {genre._id}: {genre.count}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <h3>Borrowing Statistics</h3>
            {borrowingStatistics && (
                <div>
                    <p>Total Borrowed: {borrowingStatistics.totalBorrowed}</p>
                    <p>Overdue Books: {borrowingStatistics.overdueBooks}</p>
                </div>
            )}

            <h3>User Activity Report</h3>
            {userActivity && (
                <div>
                    <ul>
                        {userActivity.map(user => (
                            <li key={user.userId}>
                                {user.name}: {user.borrowedBooksCount} borrowed books
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Reports;
