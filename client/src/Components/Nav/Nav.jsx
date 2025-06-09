import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  YouTube as YouTubeIcon,
  List as ListIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';

import './Nav.css';

function Nav({ toggleSidebar, setSearchTerm }) {
  const [isLoginMenuVisible, setLoginMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [channel, setChannel] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) fetchChannel(token);
  }, []);

  const fetchChannel = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/channel/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChannel(res.data.channel || res.data);
    } catch {
      setChannel(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setChannel(null);
    setLoginMenuVisible(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav>
      <div className="ytimg">
        <ListIcon sx={{ fontSize: 35, cursor: 'pointer' }} onClick={toggleSidebar} />
        <div className="yt">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <YouTubeIcon sx={{ color: 'red', fontSize: 40 }} />
          </Link>
          <span>YouTube</span>
        </div>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div id="search" onClick={() => setSearchTerm(searchInput)} title="Click to search" style={{ cursor: 'pointer' }}>
          <SearchIcon sx={{ fontSize: 30 }} />
        </div>
      </div>

      <div className="create">
        {isLoggedIn && (
          <Link to="/AddVideo" style={{ textDecoration: 'none' }}>
            <button className="upload-btn">
              <VideocamIcon sx={{ fontSize: 15 }} />
              <span>Upload</span>
            </button>
          </Link>
        )}

        <NotificationsIcon />

        <div className="profile" onClick={() => setLoginMenuVisible((prev) => !prev)}>
          <AccountCircleIcon sx={{ fontSize: 30, color: '#dbc9c9', cursor: 'pointer' }} />
        </div>

        {isLoginMenuVisible && (
          <div className="Login-section">
            {isLoggedIn ? (
              <>
                <button onClick={handleLogout}>Logout</button>
                <Link to="/Channel" id='Channel-B' onClick={() => setLoginMenuVisible(false)}>
                  <button>
                    {channel ? 'View Channel' : <><AddIcon /> Create Channel</>}
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/Login" onClick={() => setLoginMenuVisible(false)}>
                <button>Login</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
