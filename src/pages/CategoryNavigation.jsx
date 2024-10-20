
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryNavigation.css';

const CategoryNavigation = ({ selectedCategory }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        console.log('Navigating to category:', category);
        if (category === 'All') {
            navigate('/');
        } else if (category === 'Fiction') {
            navigate('/fiction-books');
        } else if (category === 'Non-Fiction') {
            navigate('/non-fiction-books');
        } else if (category === 'Education') {
            navigate('/education-books');
        }
    };

    return (
        <div className="category-navigation" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <button onClick={() => handleCategoryClick('All')} className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}>
                All Books
            </button>
            <button onClick={() => handleCategoryClick('Fiction')} className={`category-btn ${selectedCategory === 'Fiction' ? 'active' : ''}`}>
                Fiction
            </button>
            <button onClick={() => handleCategoryClick('Non-Fiction')} className={`category-btn ${selectedCategory === 'Non-Fiction' ? 'active' : ''}`}>
                Non-Fiction
            </button>
            <button onClick={() => handleCategoryClick('Education')} className={`category-btn ${selectedCategory === 'Education' ? 'active' : ''}`}>
                Education
            </button>
        </div>
    );
};

export default CategoryNavigation;
