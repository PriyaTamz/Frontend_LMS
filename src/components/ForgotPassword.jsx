import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import { selectEmail, setEmail } from '../features/authentication/forgotpasswordSlice';
import authServices from '../services/authServices';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useLoaderData();

    useEffect(() => {
        if (user) {
            navigate('/enter-otp');
        }
    }, [user]);

    const email = useSelector(selectEmail);

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Email:', email); 

        authServices.forgotpassword({ email })
            .then(response => {
                console.log('Forgot password response:', response);
                alert(response.data.message);

                dispatch(setEmail(''));

                setTimeout(() => {
                    navigate('/enter-otp');
                }, 500);
            })
            .catch(error => {
                console.log('Error response:', error);  
                alert(error.response?.data?.message || 'An error occurred');
            });
    }

    return (
        <div className="container">
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                    <label htmlFor="email">Enter Email Address</label>
                    <input 
                        type="text" 
                        id="email" 
                        value={email} 
                        onChange={(e) => dispatch(setEmail(e.target.value))} 
                    />
                </div>
                <button type="submit">Send OTP</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
