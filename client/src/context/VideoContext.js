// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const VideoContext = createContext();

// export const VideoProvider = ({ children }) => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('http://localhost:5000/api/videos');
//         setVideos(res.data.videos || res.data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load videos');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchVideos();
//     } else {
//       setLoading(false);
//       setVideos([]);  // clear videos if not logged in
//     }
//   }, [token]);

//   return (
//     <VideoContext.Provider value={{ videos, loading, error }}>
//       {children}
//     </VideoContext.Provider>
//   );
// };
