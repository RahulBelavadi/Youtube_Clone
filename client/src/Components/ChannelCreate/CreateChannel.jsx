import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './channelCreate.css';

function CreateChannel() {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (channelName.trim() === '') {
      alert('Channel name is required');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/channel/create',
        {
          channelName,
          description,
          channelBanner: bannerUrl,
          profileUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Channel created successfully!');
      navigate('/channel'); // or wherever you want to redirect
    } catch (error) {
      alert('Error creating channel: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="create-channel-container">
      <h2>Create Your Channel</h2>
      <form className="channel-form" onSubmit={handleSubmit}>
        <label htmlFor="channelName">Channel Name *</label>
        <input
          id="channelName"
          type="text"
          placeholder="Enter channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Tell viewers about your channel"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <label htmlFor="bannerUrl">Channel Banner URL</label>
        <input
          id="bannerUrl"
          type="url"
          placeholder="Paste banner image URL"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />

        <label htmlFor="profileUrl">Profile Picture URL</label>
        <input
          id="profileUrl"
          type="url"
          placeholder="Paste profile image URL"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />

        <button type="submit">Create Channel</button>
      </form>
    </div>
  );
}

export default CreateChannel;
