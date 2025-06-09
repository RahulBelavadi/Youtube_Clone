import React, { useState } from 'react';
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      document.getElementById('video-input').value = '';
      document.getElementById('thumbnail-input').value = '';
    } catch (err) {
      console.error(err);
      setMessage('Video upload failed.');
      navigate('/');
    }
    
  };

  

  return (
    <div className="add-video-container">
      <div className="cancel">
        <h2>Add New Video</h2>
      <button onClick={()=>{
        navigate('/');
      }}><CancelIcon sx={{color:"white",fontSize:"50px"}}/></button>
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
        <label>Upload Thumbnail Image:</label>
        <input
          id="thumbnail-input"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          required
        />
        <label>Upload Video File:</label>
        <input
          id="video-input"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          required
        />
        <button type="submit">Upload Video</button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}

export default AddVideo;
