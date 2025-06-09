import React from 'react';
import './trend.css';

function Trends({ selectedTrend, onTrendSelect }) {
  const trends = [
    'All', 'Music', 'Gaming', 'Movies', 'Sports', 'News', 'Live', 'Fashion', 
    'Learning', 'Podcasts', 'Comedy', 'Cooking', 'Travel', 'Tech', 'Art', 
    'Science', 'Fitness', 'DIY', 'Business', 'Programming',
  ];

  return (
    <div className="div">
      <div className="trends">
        {trends.map((item) => (
          <div
            key={item}
            className={`items ${selectedTrend === item ? 'selected' : ''}`}
            onClick={() => onTrendSelect(item)}
          >
            <a href="#">{item}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trends;
