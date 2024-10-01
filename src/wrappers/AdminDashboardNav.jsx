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
        navigate('/admin-login', { replace: true }); 
    };

    return (
        <nav>
            <Outlet /> 
            <ul className="dashboard-nav">
                <li>
                    <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin-dashboard/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Reports
                    </NavLink>
                </li>
                {isLoggedIn && (
                    <li>
                        <button className='buttonnav' onClick={handleLogout}>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default AdminDashboardNav;
