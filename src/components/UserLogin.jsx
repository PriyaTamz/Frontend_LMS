import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { selectEmail, selectPassword, setEmail, setPassword } from '../features/authentication/UserLoginSlice';
import authServices from '../services/authServices';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useLoaderData();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user && user.role === 'user') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);

  const handleLogin = (e) => {
    e.preventDefault();

    let valid = true;

   
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    
    if (!valid) {
      return; 
    }

    authServices.userlogin({ email, password })
      .then(response => {
        alert(response.data.message);

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        if (response.data.userId) {
          console.log(response.data);
          localStorage.setItem('userId', response.data.userId);
        }

        dispatch(setEmail(''));
        dispatch(setPassword(''));

        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      })
      .catch(error => {
        alert(error.response.data.message || 'Login failed');
      });
  };

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="buttin-nav">Back</button> {/* Back button */}
      <h1 className='header'>User Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            id='email'
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
           {emailError && <p style={{ color: 'red', margin: '0 0 0 60px' }}>{emailError}</p>}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
          {passwordError && <p style={{ color: 'red', margin: '0 0 0 80px' }}>{passwordError}</p>}
        </div>
        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;