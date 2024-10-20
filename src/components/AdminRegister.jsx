import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectName, selectEmail, selectPassword, selectRole, setName, setEmail, setPassword, setRole } from '../features/authentication/AdminRegisterSlice';
import authServices from '../services/authServices';
import './Register.css';

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);

  const handleAdminRegister = (e) => {
    e.preventDefault();
    const role = 'admin'; 
    authServices.adminRegister({ name, email, password, role })
      .then(response => {
        alert(response.data.message);

        dispatch(setName(''));
        dispatch(setEmail(''));
        dispatch(setPassword(''));
        dispatch(setRole('')); 

        setTimeout(() => {
          navigate('/admin-login');
        }, 500);
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };

  return (
    <div className="container">
       <button onClick={() => navigate(-1)} className="buttin-nav">Back</button> {/* Back button */}
      <h1 className='header'>Admin Register</h1>
      <form onSubmit={handleAdminRegister}>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
        </div>
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
            type='text'
            id='password'
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
        </div>
        <button type="submit" className='registerbutton'>Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
