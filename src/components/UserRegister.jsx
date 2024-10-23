import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectName, selectEmail, selectPassword, selectRole, setName, setEmail, setPassword, setRole } from '../features/authentication/UserRegisterSlice';
import authServices from '../services/authServices';
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    let valid = true;

   
    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

   
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


    const role = 'user'; 
    authServices.userRegister({ name, email, password, role })
      .then(response => {
        alert(response.data.message);

        dispatch(setName(''));
        dispatch(setEmail(''));
        dispatch(setPassword(''));
        dispatch(setRole('')); 

        setTimeout(() => {
          navigate('/user-login');
        }, 500);
      })
      .catch(error => {
        alert(error.response.data.message || 'Registration failed');
      });
  };

  return (
    <div className="container">
       <button onClick={() => navigate(-1)} className="buttin-nav">Back</button> 
      <h1 className='header'>User Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
          {nameError && <p style={{ color: 'red', margin: '0 0 0 60px' }}>{nameError}</p>}
        </div>
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
            type='text'
            id='password'
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
          {passwordError && <p style={{ color: 'red',  margin: '0 0 0 80px'  }}>{passwordError}</p>}
        </div>
        <button type="submit" className='registerbutton'>Register</button>
      </form>
    </div>
  );
};

export default Register;
