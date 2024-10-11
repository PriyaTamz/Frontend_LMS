import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { selectEmail, selectPassword, setEmail, setPassword } from '../features/authentication/AdminLoginSlice';
import authServices from '../services/authServices';
import './Login.css'; 

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useLoaderData();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);

  const handleAdminLogin = (e) => {
    e.preventDefault();
  
    authServices.adminlogin({ email, password })
      .then(response => {
        alert(response.data.message);
  
        /*if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }*/

        if (response.data.adminId) {
          console.log(response.data);
          localStorage.setItem('adminId', response.data.adminId);
        }
  
        dispatch(setEmail(''));
        dispatch(setPassword(''));

        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 500);
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };
  

  return (
    <div className="container">
      <h1 className='header'>Admin Login</h1>
      <form onSubmit={handleAdminLogin}>
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

export default AdminLogin;
