import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import ShareIcon from '@mui/icons-material/Share';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';


function Video({ showSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [video, setVideo] = useState(location.state || null);
  const [suggested, setSuggested] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [channel, setChannel] = useState(null);

  const token = localStorage.getItem('token');

  const user = JSON.parse(localStorage.getItem('user'));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/channel/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChannel(res.data.channel || res.data);
      } catch (error) {
        console.error('Error fetching channel:', error);
      }
    };
    fetchChannel();
  }, [token]);

  // Fetch video if not provided via state (e.g. page refresh)
  useEffect(() => {
    if (!video && id) {
      axios
        .get(`http://localhost:5000/api/videos/${id}`)
        .then((res) => setVideo(res.data))
        .catch(() => navigate('/'));
    }
  }, [video, id, navigate]);

  // Increment views only when video._id changes (first load or video switch)
  useEffect(() => {
    if (!video?._id) return;

    const incrementViews = async () => {
      try {
        await axios.patch(`http://localhost:5000/api/videos/${video._id}/view`);
      } catch (err) {
        console.error('Failed to increment views', err);
      }
    };

    incrementViews();
  }, [video?._id]);

  // Fetch comments when video changes
  useEffect(() => {
    if (!video?._id) return;

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

    fetchComments();
  }, [video?._id]);

  // Fetch suggested videos excluding current one
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        const filtered = res.data.filter((v) => v._id !== video._id);
        setSuggested(filtered);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    };

    if (video) {
      fetchSuggested();
    }
  }, [video]);

  // Like video
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

  // Dislike video
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

  // Submit new comment
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
      // Refresh comments
      const res = await axios.get(`http://localhost:5000/api/comments/${video._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error posting comment', err);
    }
  };

  // Submit reply to comment
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
      // Refresh comments
      const res = await axios.get(`http://localhost:5000/api/comments/${video._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error posting reply', err);
    }
  };

  // Like a comment
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
      // Refresh comments
      const res = await axios.get(`http://localhost:5000/api/comments/${video._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error liking comment', err);
    }
  };

  if (!video) return <p>Loading video...</p>;

  // Update video and URL when suggested video clicked
  const handleSuggestedClick = (clickedVideo) => {
    setVideo(clickedVideo);
    navigate(`/video/${clickedVideo._id}`, { state: clickedVideo }); // Update URL

    // Fetch comments for clicked video
    axios
      .get(`http://localhost:5000/api/comments/${clickedVideo._id}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  };

  console.log(video);
  

  return (
    <div className="video-page">
      {showSidebar && <Left />}

      <div className="left-info">
        <video
          key={video._id} // This forces reload of video when video changes
          crossOrigin="anonymous"
          controls
          autoPlay
          style={{ width: '100%', maxHeight: '500px' }}
        >
          <source src={`http://localhost:5000/${video.videoUrl}`} type="video/mp4" />
        </video>

        <h1>{video.title}</h1>
            

        <div className="info">
          <div className="channel-info">
            {/* <AccountCircleIcon sx={{ fontSize: '30px', color: '#dbc9c9' }} /> */}
            <img id='channelimg'
            crossOrigin="anonymous" src={`http://localhost:5000/${video.thumbnailUrl}`} alt="" />
            {channel?.channel}
            <button>
              <NotificationsIcon /> Subscribe <KeyboardArrowDownIcon />
            </button>
            <div className="likes">         
            <button className="likes-" onClick={handleLike}>
              <ThumbUpIcon sx={{ fontSize: '18px',marginRight:"10px" }} />
              {video.likes}
            </button>    
            |      
            <button className="dislike-" onClick={handleDislike}>
              <ThumbDownIcon sx={{ fontSize: '18px',marginRight:"10px" }} />
               
              {video.dislikes}
            </button>
          </div>
           <div className="share">
            <ShareIcon/>
           </div>
           <div className="download">
            <DownloadForOfflineIcon sx={{fontSize:'35px'}} />
           </div>
          </div>

          {/* Like/Dislike Buttons */}
          
        </div>

        <div className="dis">
          <br />
          {`views ${video.views}`} &nbsp;
          <span id="channelName">{moment(video.createdAt).fromNow()}</span>
          <br />
          {video.description}
        </div>
        <br />
        {/* <div className="more">
          <MoreHorizIcon />
        </div> */}
        <br />
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
                <AccountCircleIcon sx={{ fontSize: '40px', marginRight: '10px' }} />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="comment-time">{moment(comment.createdAt).fromNow()}</span>
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
                      onClick={() =>
                        setReplyingTo(replyingTo === comment._id ? null : comment._id)
                      }
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
                              <span className="reply-time">{moment(reply.createdAt).fromNow()}</span>
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
              onClick={() => handleSuggestedClick(video)}
            >
              <video
                crossOrigin="anonymous"
                muted
                onMouseOver={(e) => {
                  const playPromise = e.target.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                  }
                }}
                onMouseOut={(e) => e.target.pause()}
                className="suggested-thumb"
              >
                <source src={`http://localhost:5000/${video.videoUrl}`} type="video/mp4" />
              </video>
              <div className="suggested-details">
                <h4>{video.title}</h4>
                {/* <p>{video.uploadedBy?.channelName || 'Unknown'}</p> */}
                <p>{channel?.channelName}</p>

                <p>{video.views || 0} views</p>
                <p>{moment(video.createdAt).fromNow()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Video;
