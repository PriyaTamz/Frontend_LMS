import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';
import './UserDashboardNav.css';


const UserDashboardNav = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const isLoggedIn = !!localStorage.getItem('token');


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/user-login');
        } else {
            authServices.getUserProfile()
                .then(response => {
                    setUserName(response.data.user.name);
                    console.log("Fetched User Name:", response.data.user.name);
                })
                .catch(error => {
                    console.error("Error fetching user profile:", error);
                    navigate('/user-login');
                });
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <nav>
                <div className='profile'>
                    <NavLink to="/my-profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                        My Profile
                    </NavLink>
                </div>

                <div className='logout'>
                    {isLoggedIn && (
                        <button onClick={handleLogout} className='buttonnav'>Logout</button>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default UserDashboardNav;
