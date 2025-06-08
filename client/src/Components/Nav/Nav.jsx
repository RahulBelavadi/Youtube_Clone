import './Nav.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';

function Nav({ toggleSidebar, setSearchTerm, channelT }) {
  const [isLoginMenuVisible, setLoginMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  function handleProfileClick() {
    setLoginMenuVisible(!isLoginMenuVisible);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
  }

  // Update parent searchTerm state as user types
  function handleInputChange(e) {
    setSearchInput(e.target.value);
    setSearchTerm(e.target.value);
  }

  return (
    <nav>
      <div className="ytimg">
        <ListIcon sx={{ fontSize: '35px', cursor: 'pointer' }} onClick={toggleSidebar} />
        <div className='yt'>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <YouTubeIcon sx={{ color: 'red', fontSize: '40px' }} />
          </Link>
          <span>YouTube</span>
        </div>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder='Search'
          value={searchInput}
          onChange={handleInputChange}
        />
        <div id='search'>
          <SearchIcon sx={{ fontSize: '30px' }} />
        </div>
      </div>

      <div className="create">
        <div>
          <Link style={{ textDecoration: "none" }} to="/AddVideo" onClick={() => setLoginMenuVisible(false)} className="upload-btn">
            {isLoggedIn && <button>
              <VideocamIcon sx={{ fontSize: '15px' }} />
              <span>Upload</span>
            </button>}
          </Link>
        </div>

        <NotificationsIcon />

        <div className="profile" onClick={handleProfileClick}>
          <AccountCircleIcon sx={{ fontSize: '30px', color: "#dbc9c9", cursor: "pointer" }} />
        </div>

        {isLoginMenuVisible && (
          <div className='Login-section'>
            {isLoggedIn ? (
              <>
                <button onClick={() => {
                  handleLogout();
                  setLoginMenuVisible(false);
                }}>
                  Logout
                </button>

                <Link to="/Channel" onClick={() => {
                  channelT();
                  setLoginMenuVisible(false);
                }}>
                  <button><AddIcon /> Create</button>
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
