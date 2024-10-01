import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import authServices from '../services/authServices';
import './HomeNav.css';

const HomeNav = () => {
  const [searchField, setSearchField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    let queryParams = {};

    if (searchField === 'all') {
      queryParams.all = searchQuery;
    } else if (searchField === 'title') {
      queryParams = { title: searchQuery };
    } else if (searchField === 'author') {
      queryParams = { author: searchQuery };
    } else if (searchField === 'genre') {
      queryParams = { genre: searchQuery };
    }

    try {
      const result = await authServices.searchBooks(queryParams);
      navigate('/search-results', { state: { books: result.data.books } });
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleRegister = () => {
   
    if (role === 'user') {
      navigate('/user-register');
    } else if (role === 'admin') {
      navigate('/admin-register');
    }
  };

  const handleLogin = () => {
   
    if (role === 'user') {
      navigate('/user-login');
    } else if (role === 'admin') {
      navigate('/admin-login');
    }
  };

  return (
    <div className="outer-container">
      <nav>
        <div className='combine'>
          <div className='library-name'>
            <Link to="/">Open Library</Link>
          </div>
          <div className='mybooks'>
            <Link to="/my-books">My Books</Link>
          </div>
          <div className='log-reg'>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
          </div>
        </div>
        <div>
        </div>
        <form onSubmit={handleSearch}>
          <div className='search'>
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchField}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </nav>
      <Outlet />
    </div>
  );
}

export default HomeNav;