
import React from 'react';

const GenreNav = ({ onSelectGenre }) => {
    return (
        <div className="genre-nav">
            <h6>Genre Categories</h6>
            <div className="genre-links">
                <a href="#" onClick={() => onSelectGenre('all')}>All Books</a>
                <a href="#" onClick={() => onSelectGenre('fiction')}>Fiction</a>
                <a href="#" onClick={() => onSelectGenre('non-fiction')}>Non-Fiction</a>
                <a href="#" onClick={() => onSelectGenre('education')}>Education</a>
            </div>
        </div>
    );
};

export default GenreNav;
