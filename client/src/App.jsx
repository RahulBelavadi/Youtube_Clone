import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Mainbody from './Components/Main/Mainbody'
import Nav from './Components/Nav/Nav'
import Channel from './Components/Channel/Channel'
import Video from './Components/VideoPage/Video';
import Login from './Components/Login/Login'
import SignUp from './Components/Login/SignUp'
import CreateChannel from './Components/ChannelCreate/CreateChannel';
import AddVideo from './Components/AddVideo/AddVideo';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelToggle, setchannelToggle] = useState(false)

  function channelT() {
    setchannelToggle(prev => !prev);
  }

  return (
    <>
      <Nav toggleSidebar={() => setShowSidebar(!showSidebar)} setSearchTerm={setSearchTerm} channelT={channelT} />

      <Routes>
        <Route
          path="/"
          element={
            <Mainbody
              showSidebar={showSidebar}
              channelToggle={channelToggle}
              searchTerm={searchTerm}
            />
          }
        />
        <Route path="/video" element={<Video showSidebar={showSidebar} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Channel" element={<Channel showSidebar={showSidebar} />} />
        <Route path="/CreateChannel" element={<CreateChannel />} />
        <Route path="/AddVideo" element={<AddVideo />} />
      </Routes>
    </>
  );
}

export default App;
