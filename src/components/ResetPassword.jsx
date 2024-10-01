import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectToken, setToken, selectNewPassword, selectConfirmPassword, setNewPassword, setConfirmPassword } from '../features/authentication/resetPasswordSlice';
import authServices from '../services/authServices';
import { setEmail, setPassword } from '../features/authentication/UserRegisterSlice';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

   
    const query = new URLSearchParams(location.search);
    const tokenFromUrl = query.get('token');

    useEffect(() => {
        if (tokenFromUrl) {
            dispatch(setToken(tokenFromUrl));
        }
    }, [dispatch, tokenFromUrl]);

    const token = useSelector(selectToken);
    const newPassword = useSelector(selectNewPassword);
    const confirmPassword = useSelector(selectConfirmPassword);

    const handlePwd = (e) => {
        e.preventDefault();

        if (!token) {
            alert("Token is missing");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        authServices.resetpassword({ token, newPassword, confirmPassword })
            .then(response => {
                alert(response.data.message);
                dispatch(setNewPassword(''));
                dispatch(setConfirmPassword(''));
                dispatch(setToken('')); 
                setTimeout(() => navigate('/user-login'), 500);

                dispatch(setEmail(''));
                dispatch(setPassword(''));
            })
            .catch(error => {
                console.log('Error response:', error);
                alert(error.response?.data?.message || 'An error occurred');
            });
    }

    return (
        <div className="container">
            <h1>Reset Password</h1>
            <form onSubmit={handlePwd}>
                <div className="form-group">
                    <label htmlFor='token'>OTP</label>
                    <input
                        type='text'
                        id='token'
                        value={token}
                        onChange={(e) => dispatch(setToken(e.target.value))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor='newPassword'>New Password</label>
                    <input
                        type='password'
                        id='newPassword'
                        value={newPassword}
                        onChange={(e) => dispatch(setNewPassword(e.target.value))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input
                        type='password'
                        id='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
                    />
                </div>

                <button type='submit'>Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
