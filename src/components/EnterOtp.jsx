import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectOtp, setOtp } from '../features/authentication/enterOtpSlice';
import authServices from '../services/authServices';

const EnterOtp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const otp = useSelector(selectOtp);

    const handleOTP = (e) => {
        e.preventDefault();
        if (!otp) {
            alert("Please enter the OTP");
            return;
        }

        authServices.enterOtp(otp)
          .then(response => {
            console.log('Otp response:', response);
            alert(response.data.message);

            dispatch(setOtp(''));

            setTimeout(() => {
              navigate('/reset-password');
            }, 500);
          })
          .catch(error => {
            console.log('Error response:', error);
            alert(error.response?.data?.message || 'An error occurred');
          });
    };

    return (
        <div className="container">
            <h1>Enter OTP</h1>
            <form onSubmit={handleOTP}>
                <div className="form-group">
                    <label htmlFor='otp'>Enter OTP</label>
                    <input
                        type='text'
                        id='otp'
                        value={otp}
                        onChange={(e) => dispatch(setOtp(e.target.value))}
                    />
                </div>
                <button type="submit">Confirm OTP</button>
            </form>
        </div>
    );
};

export default EnterOtp;
