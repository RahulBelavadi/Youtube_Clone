import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './video.css';
import Trends from '../Trends/Trends';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import Left from '../LeftSide/Left';
import axios from 'axios';
import moment from 'moment';

function Video({ showSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const videoData = location.state;

  const [video, setVideo] = useState(videoData);
  const [suggested, setSuggested] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!videoData) {
      navigate('/');
      return;
    }

    const incrementViews = async () => {
      try {
        await axios.patch(
          `http://localhost:5000/api/videos/${videoData._id}/view`
        );
      } catch (err) {
        console.error('Failed to increment views', err);
      }
    };

    incrementViews();
    fetchComments();
  }, [videoData, navigate]);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        const filtered = res.data.filter((v) => v._id !== videoData._id);
        setSuggested(filtered);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    };

    if (videoData) {
      fetchSuggested();
    }
  }, [videoData]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${video._id}`
      );
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments', err);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert('Please login to like videos!');
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/videos/${video._id}/like`,
        {},
        config
      );
      setVideo(res.data);
    } catch (err) {
      console.error('Error liking video', err);
    }
  };

  const handleDislike = async () => {
    if (!token) {
      alert('Please login to dislike videos!');
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/videos/${video._id}/dislike`,
        {},
        config
      );
      setVideo(res.data);
    } catch (err) {
      console.error('Error disliking video', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!token) {
      alert('Please login to comment!');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await axios.post(
        'http://localhost:5000/api/comments',
        {
          videoId: video._id,
          text: newComment,
        },
        config
      );
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment', err);
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!token) {
      alert('Please login to reply!');
      return;
    }

    if (!replyText.trim()) return;

    try {
      await axios.post(
        'http://localhost:5000/api/comments/reply',
        {
          commentId,
          text: replyText,
        },
        config
      );
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error('Error posting reply', err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!token) {
      alert('Please login to like comments!');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {},
        config
      );
      fetchComments();
    } catch (err) {
      console.error('Error liking comment', err);
    }
  };

  if (!video) return null;

  return (
    <div className="video-page">
      {showSidebar && <Left />}

      <div className="left-info">
        <video controls style={{ width: '100%', maxHeight: '500px' }}>
          <source
            src={`http://localhost:5000/uploads/${video.videoUrl}`}
            type="video/mp4"
          />
        </video>

        <h1>{video.title}</h1>

        <div className="info">
          <div className="channel-info">
            <AccountCircleIcon sx={{ fontSize: '30px', color: '#dbc9c9' }} />
            <h3>{video.uploadedBy?.channelName || 'Unknown Channel'}</h3>
            <button>
              <NotificationsIcon /> Subscribe <KeyboardArrowDownIcon />
            </button>
          </div>

          <div className="likes">
            <div className="likes-">
              <h3>{video.likes || 0}</h3>
              <h3
                style={{ cursor: 'pointer' }}
                onClick={handleLike}
                title="Like"
              >
                <ThumbUpIcon
                  sx={{
                    fontSize: '20px',
                    color: video.likes > 0 ? 'blue' : 'white',
                  }}
                />
              </h3>
              |
              <h3>{video.dislikes || 0}</h3>
              <h3
                style={{ cursor: 'pointer' }}
                onClick={handleDislike}
                title="Dislike"
              >
                <ThumbDownIcon
                  sx={{
                    fontSize: '20px',
                    color: video.dislikes > 0 ? 'red' : 'white',
                  }}
                />
              </h3>
            </div>

            <div className="share">
              <ReplyAllIcon />
              Share
            </div>
            <div className="options">
              <MoreHorizIcon />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>{comments.length} Comments</h3>

          {/* Comment Input */}
          <div className="comment-input">
            <AccountCircleIcon sx={{ fontSize: '40px', marginRight: '10px' }} />
            <div className="input-container">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>
                <SendIcon />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <AccountCircleIcon
                  sx={{ fontSize: '40px', marginRight: '10px' }}
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="comment-time">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="like-btn"
                    >
                      <ThumbUpIcon sx={{ fontSize: '16px' }} />
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="reply-btn"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Input (shown when replying) */}
                  {replyingTo === comment._id && (
                    <div className="reply-input">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <button onClick={() => handleReplySubmit(comment._id)}>
                        <SendIcon />
                      </button>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies?.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="reply">
                          <AccountCircleIcon
                            sx={{ fontSize: '30px', marginRight: '10px' }}
                          />
                          <div className="reply-content">
                            <div className="reply-header">
                              <span className="reply-author">
                                {reply.user?.username || 'Anonymous'}
                              </span>
                              <span className="reply-time">
                                {moment(reply.createdAt).fromNow()}
                              </span>
                            </div>
                            <p className="reply-text">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right-info">
        <div className="tr">
          <Trends className="trn2" />
        </div>

        <br />

        <div className="Videos-s">
          {suggested.map((video, index) => (
            <div
              key={index}
              className="suggested-video"
              onClick={() => navigate('/video', { state: video })}
            >
              <video muted controls className="suggested-thumb">
                <source
                  src={`http://localhost:5000/uploads/${video.videoUrl}`}
                  type="video/mp4"
                />
              </video>
              <div className="suggested-details">
                <h4>{video.title}</h4>
                <p>{video.uploadedBy?.channelName || 'Unknown'}</p>
                <p>{video.views || 0} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Video;