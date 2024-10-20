import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import { Outlet } from 'react-router-dom';
import './AdminDashboardNav.css';

const AdminDashboardNav = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const isLoggedIn = !!localStorage.getItem('token');


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/admin-login');
        } else {
            authServices.getAdminProfile()
                .then(response => {
                    setAdminName(response.data.admin.name);
                    console.log("Fetched Admin Name:", response.data.admin.name);
                })
                .catch(error => {
                    console.error("Error fetching admin profile:", error);
                    navigate('/admin-login');
                });
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
    };

    return (
        <div className="dashboard-container">
            <nav>
                <div className='report'>
                    <NavLink to="/admin-dashboard/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
                        User Report
                    </NavLink>
                </div>

                <div className='logout'>
                    {isLoggedIn && (
                        <button className="buttonnav" onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </nav>
            <Outlet />
        </div>
    );
};

export default AdminDashboardNav;
