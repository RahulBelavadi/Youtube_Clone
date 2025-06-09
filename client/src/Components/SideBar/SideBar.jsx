import './sidebar.css';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SwitchVideoIcon from '@mui/icons-material/SwitchVideo';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function SideBar() {
  const navigate = useNavigate();

  const options = [
    {
      Name: 'Home',
      icon: <HomeIcon sx={{ color: 'white' }} />,
      path: '/',
    },
    {
      Name: 'Shorts',
      icon: <SwitchVideoIcon sx={{ color: 'white' }} />,
      path: '/shorts',
    },
    {
      Name: 'Subscribe',
      icon: <SubscriptionsIcon sx={{ color: 'white' }} />,
      path: '/subscribe',
    },
    {
      Name: 'You',
      icon: <AccountCircleIcon sx={{ color: 'white' }} />,
      path: '/you',
    },
  ];

  return (
    <div className="sidebar">
      {options.map((val, ind) => (
        <div key={ind} className="buttons">
          <div className="op" onClick={() => navigate(val.path)} style={{ cursor: 'pointer' }}>
            <button>{val.icon}</button>
            <p>{val.Name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
