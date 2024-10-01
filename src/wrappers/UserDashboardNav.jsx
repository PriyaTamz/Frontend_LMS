import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './UserDashboardNav.css'; 
import authServices from '../services/authServices'; 

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
        navigate('/user-login'); 
    };

    return (
        <nav>
            <span className="user-name">
                {userName}
            </span>
            <ul className="dashboard-nav">
                <li>
                    <NavLink to="/my-books" className={({ isActive }) => (isActive ? 'active' : '')}>
                        My Books
                    </NavLink>
                </li>
                {isLoggedIn && (
                    <li>
                        <button onClick={handleLogout} className='buttonnav'>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default UserDashboardNav;
