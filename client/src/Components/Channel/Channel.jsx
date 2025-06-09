import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './channel.css';
import Left from '../LeftSide/Left';
import moment from 'moment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Channel({ showSidebar }) {
  const [channel, setChannel] = useState(null);
  const [myVideos, setMyVideos] = useState([]);
  const button = ['Home', 'Playlist', 'Post'];
  const token = localStorage.getItem('token');

  // Fetch channel info
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/channel/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChannel(res.data.channel || res.data);
      } catch (error) {
        console.error('Error fetching channel:', error);
      }
    };
    fetchChannel();
  }, [token]);

  // Fetch videos for the channel
  useEffect(() => {
    const fetchVideos = async () => {
      if (!channel?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/videos?userId=${channel._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyVideos(res.data.videos || res.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, [channel, token]);

  if (!channel) return <p>Loading channel info...</p>;
console.log(myVideos);

  return (
    <div className="Main">
      {showSidebar && <Left />}
      <div className="infos">
        <div className="Profile-P">
          <div className="p-Details">
            {channel.channelBanner ? (
              <img src={channel.channelBanner} alt="Channel Banner" />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 100, color: '#ccc' }} />
            )}
          </div>
          <div className="info">
            <h2>{channel.channelName || 'No Channel Name'}</h2>
            <p>
              @{channel.channelName?.replace(/\s+/g, '')} ·{' '}
              {channel.subscribers || 0} subscribers
            </p>
            <p>
              {channel.description || 'No description available.'}{' '}
              <span className="more">...more</span>
            </p>
            {channel.profileUrl && (
              <a href={channel.profileUrl} target="_blank" rel="noopener noreferrer">
                Profile Link
              </a>
            )}
            <div className="channel-buttons">
              <button>Customize channel</button>
              <button>Manage videos</button>
            </div>
          </div>
        </div>

        <div className="button">
          {button.map((btn, index) => (
            <button key={index}>{btn}</button>
          ))}
        </div>

        <div className="channel-videos">
          {myVideos.length === 0 ? (
            <p>No videos uploaded yet.</p>
          ) : (
            myVideos.map((video) => (
              <div key={video._id} className="channel-video-card">
                <div className="channel-video-thumbnail">
                  <video onMouseOver={(e) => {
                  const playPromise = e.target.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                  }
                }}
                onMouseOut={(e) => e.target.pause()}
                    crossOrigin="anonymous"
                    src={`http://localhost:5000/${video.videoUrl}`} type="video/mp4"
                    width="300"
                    height="200"
                    controls
                  />
                  <span className="channel-video-duration">⏱️</span>
                </div>
                <div className="channel-video-info">
                  <div className="channel-icon">👤</div>
                  <div className="channel-video-details">
                    <h4>{video.title}</h4>
                    <p>
                      {video.views || 0} views · {moment(video.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Channel;
