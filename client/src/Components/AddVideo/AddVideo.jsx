import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './addVideo.css';
import { useNavigate } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';

function AddVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const videoInputRef = useRef();
  const thumbnailInputRef = useRef();

  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnailFile) {
      return setMessage('Please select both video and thumbnail files.');
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Video uploaded successfully!');
      navigate('/') 
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);

      if (videoInputRef.current) videoInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setMessage('Video upload failed.');
      navigate('/')  
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message === 'Video uploaded successfully!') {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="add-video-container">
      <div className="cancel">
        <h2>Add New Video</h2>
        <button onClick={() => navigate('/')}>
          <CancelIcon sx={{ color: 'white', fontSize: '50px' }} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="add-video-form">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label htmlFor="thumbnail-input">Upload Thumbnail Image:</label>
        <input
          id="thumbnail-input"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          ref={thumbnailInputRef}
          required
        />
        <label htmlFor="video-input">Upload Video File:</label>
        <input
          id="video-input"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          ref={videoInputRef}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}

export default AddVideo;
