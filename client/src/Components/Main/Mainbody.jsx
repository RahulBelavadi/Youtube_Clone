import React, { useEffect, useState } from 'react';
import './main.css';
import Left from '../LeftSide/Left';
import Trends from '../Trends/Trends';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../SideBar/SideBar';

function Mainbody({ showSidebar, channelToggle, searchTerm }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState('All');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/videos'); // backend route to get all videos
        setVideos(res.data.videos || res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchVideos();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Filter videos by searchTerm and selectedTrend
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());

    // If selected trend is 'All', ignore trend filtering
    if (selectedTrend === 'All') {
      return matchesSearch;
    }

    // Assuming your video object has a category or tags property for filtering by trend
    // For example, video.category or video.tags includes selectedTrend
    // Adjust this according to your video data structure

    const videoCategory = video.category || ''; // fallback empty string if no category

    const matchesTrend = videoCategory.toLowerCase() === selectedTrend.toLowerCase();

    return matchesSearch && matchesTrend;
  });

  if (loading)
    return (
      <h2 style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
        Loading videos...
      </h2>
    );
  if (error)
    return (
      <h2 style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
        {error}
      </h2>
    );

  return (
    <main>
      {showSidebar ? <Left />:<SideBar/>}
      

      <div className="Right">
        <div className="div">
          <Trends selectedTrend={selectedTrend} onTrendSelect={setSelectedTrend} />
        </div>

        <div className="videos">
          {!token ? (
            <h2 style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
              Please login to view videos.
            </h2>
          ) : filteredVideos.length === 0 ? (
            <h2 style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
              No videos available.
            </h2>
          ) : (
            filteredVideos.map((val, ind) => (
              <div
                className="vid1"
                key={ind}
                onClick={() => navigate('/video', { state: val })}
                style={{ cursor: 'pointer' }}
              >
                <video
                  muted
                  loop
                  controls
                  onMouseOver={(e) => {
                    const playPromise = e.target.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }}
                  onMouseOut={(e) => e.target.pause()}
                >
                  <source
                    src={`http://localhost:5000/videos/${val.videoUrl}`}
                    type="video/mp4"
                  />
                </video>
                <div className="details">
                  <div className="image">
                    <img
                      src={`http://localhost:5000/thumbnails/${val.thumbnailUrl}`}
                      alt={val.title}
                    />
                    <div className="titles">
                      <span id="title">{val.title}</span>
                      <span id="channelName">
                        {val.uploadedBy?.channelName || 'Unknown'}
                      </span>
                      <span id="likes">{val.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Mainbody;
