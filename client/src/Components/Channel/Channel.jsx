import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './channel.css';
import Left from '../LeftSide/Left';

function Channel({ showSidebar }) {
  const [channel, setChannel] = useState(null);
  const [myVideos, setMyVideos] = useState([]);
  const button = ['Home', 'Playlist', 'Post'];
  console.log(channel);

  useEffect(() => {
    const fetchChannel = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/videos/myvideos', {

          headers: { Authorization: `Bearer ${token}` },
        });
        setChannel(res.data);
      } catch (error) {
        console.error('Error fetching channel:', error);
      }
    };
    fetchChannel();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/videos', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter videos that belong to the logged-in user's channel
        const userVideos = res.data.filter(
          (video) => video.uploadedBy && video.uploadedBy._id === channel._id
        );

        setMyVideos(userVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    if (channel?._id) {
      fetchVideos();
    }
  }, [channel]);

  if (!channel) return <p>Loading channel info...</p>;

  return (
    <div className="Main">
      {showSidebar && <Left />}
      <div className="infos">
        <div className="Profile-P">
          <div className="p-Details">
            <img
              src={
                channel.channelBanner ||
                'https://marketplace.canva.com/EAGB3AnqOvw/2/0/1600w/canva-yellow-and-red-bright-and-playful-youtube-thumbnail-CgL1zxwL2bE.jpg'
              }
              alt="Channel Banner"
            />
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
              <a
                href={channel.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
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

        <div className="videos">
          {myVideos.length === 0 ? (
            <p>No videos uploaded yet.</p>
          ) : (
            myVideos.map((video) => (
              <div key={video._id} className="video-card">
                <video
                  src={video.videoUrl}
                  width="300"
                  height="200"
                  controls
                ></video>
                <p>{video.title}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Channel;
