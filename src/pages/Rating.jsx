import React from 'react';
import './Rating.css'; 

function Rating({ rating }) {
    const totalStars = 5;
  
    const filledStars = Math.min(Math.max(Math.round(rating), 0), totalStars); 

    return (
        <div className="rating">
            {[...Array(totalStars)].map((_, index) => (
                <span
                    key={index}
                    className={`fa fa-star ${index < filledStars ? 'checked' : ''}`}
                ></span>
            ))}
        </div>
    );
}

export default Rating;
