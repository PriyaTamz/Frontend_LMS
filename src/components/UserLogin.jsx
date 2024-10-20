import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { selectEmail, selectPassword, setEmail, setPassword } from '../features/authentication/UserLoginSlice';
import authServices from '../services/authServices';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useLoaderData();

  useEffect(() => {
    if (user && user.role === 'user') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);

  const handleLogin = (e) => {
    e.preventDefault();

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
        alert(error.response.data.message);
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
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
        </div>
        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;