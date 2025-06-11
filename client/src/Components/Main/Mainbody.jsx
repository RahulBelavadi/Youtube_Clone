import React, { useEffect, useState } from 'react';
import './main.css';
import Left from '../LeftSide/Left';
import Trends from '../Trends/Trends';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../SideBar/SideBar';
import moment from 'moment';

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
        const res = await axios.get('http://localhost:5000/api/videos');
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

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedTrend === 'All') return matchesSearch;

    const videoCategory = video.category || '';
    const matchesTrend = videoCategory.toLowerCase() === selectedTrend.toLowerCase();
    return matchesSearch && matchesTrend;
  });

  console.log(videos);
  
  return (
    <main>
      {showSidebar ? <Left /> : <SideBar />}

      <div className="Right">
        <div className="trends-wrapper">
          <Trends selectedTrend={selectedTrend} onTrendSelect={setSelectedTrend} />
        </div>

        <div className="videos">
          {!token ? (
            <h2 className="message">Please login to view videos.</h2>
          ) : filteredVideos.length === 0 ? (
            <h2 className="message">No videos available.</h2>
          ) : (
            filteredVideos.map((val, ind) => (
              <div
                className="vid1"
                key={ind}
                onClick={() => navigate(`/video/${val._id}`, { state: val })}
              >
                <video
                crossOrigin="anonymous"
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
                  <source  src={`http://localhost:5000/${val.videoUrl}`} type="video/mp4"/>
                </video>

                <div className="details">
                  <div className="image">
                    
                    <img
                    crossOrigin="anonymous"
                        className="video-thumbnail"
                        src={`http://localhost:5000/${val.thumbnailUrl}`}
                        alt={val.title}
                      />

                    
                    <div className="titles">
                    <h3 id="title">{val.title}</h3> 
                    
                      <h5>{val.description}</h5>
                      
                    <div className="createAt">
                        <span id="likes">{val.views || 0} views  &nbsp;</span>
                         <span id="channelName">{moment(val.createdAt).fromNow()}</span>
                    </div>
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
