import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import YouTubeIcon from '@mui/icons-material/YouTube';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideocamIcon from '@mui/icons-material/Videocam';

import './Nav.css';

function Nav({ toggleSidebar, setSearchTerm }) {
  const [isLoginMenuVisible, setLoginMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [channel, setChannel] = useState(null); // will hold channel data if exists

  const navigate = useNavigate();

  // Check login status and fetch channel on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchChannel(token);
    }
  }, []);

  // Fetch channel info from backend
  const fetchChannel = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/channel/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChannel(res.data.channel || res.data); // Adjust depending on your API response
    } catch (error) {
      // No channel or error fetching
      setChannel(null);
    }
  };

  // Toggle login dropdown menu
  const handleProfileClick = () => {
    setLoginMenuVisible((prev) => !prev);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setChannel(null);
    setLoginMenuVisible(false);
    navigate('/'); // Redirect to home after logout
    window.location.reload(); // optional, reload page to reset state
  };

  // Update input value on typing, but don't search yet
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Trigger search only when search icon clicked
  const handleSearchClick = () => {
    setSearchTerm(searchInput);
  };

  return (
    <nav>
      <div className="ytimg">
        <ListIcon sx={{ fontSize: '35px', cursor: 'pointer' }} onClick={toggleSidebar} />
        <div className="yt">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <YouTubeIcon sx={{ color: 'red', fontSize: '40px' }} />
          </Link>
          <span>YouTube</span>
        </div>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={handleInputChange}
        />
        <div
          id="search"
          onClick={handleSearchClick}
          style={{ cursor: 'pointer' }}
          title="Click to search"
        >
          <SearchIcon sx={{ fontSize: '30px' }} />
        </div>
      </div>

      <div className="create">
        <div>
          {isLoggedIn && (
            <Link to="/AddVideo" style={{ textDecoration: 'none' }}>
              <button className="upload-btn">
                <VideocamIcon sx={{ fontSize: '15px' }} />
                <span>Upload</span>
              </button>
            </Link>
          )}
        </div>

        <NotificationsIcon />

        <div className="profile" onClick={handleProfileClick}>
          <AccountCircleIcon
            sx={{ fontSize: '30px', color: '#dbc9c9', cursor: 'pointer' }}
          />
        </div>

        {isLoginMenuVisible && (
          <div className="Login-section">
            {isLoggedIn ? (
              <>
                <button onClick={handleLogout}>Logout</button>

                {channel ? (
                  <Link to="/CreateChannel" onClick={() => setLoginMenuVisible(false)}>
                    <button>View Channel</button>
                  </Link>
                ) : (
                  <Link to="/CreateChannel" onClick={() => setLoginMenuVisible(false)}>
                    <button>
                      <AddIcon /> Create Channel
                    </button>
                  </Link>
                )}
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
