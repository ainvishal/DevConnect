import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommentsModel from './CommentsModel';

const Post = ({ postId, title, author, content, userId, likes: initialLikes, dislikes: initialDislikes }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [message, setMessage] = useState('');
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInteractionStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/interaction-status/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        if (data.interaction_type === 'like') {
          setIsLiked(true);
          setIsDisliked(false);
        } else if (data.interaction_type === 'dislike') {
          setIsLiked(false);
          setIsDisliked(true);
        }
      } catch (error) {
        console.error('Error fetching interaction status:', error);
      }
    };

    fetchInteractionStatus();
  }, [postId]);

  const handleLike = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (isLiked) {
          setLikes((prev) => prev - 1); // Unlike
          setIsLiked(false);
        } else {
          setLikes((prev) => prev + 1); // Like
          if (isDisliked) {
            setDislikes((prev) => prev - 1); // Remove dislike if it was disliked
          }
          setIsLiked(true);
          setIsDisliked(false);
        }
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Error liking the post.');
      }
    } catch (error) {
      setMessage('Error liking the post.');
    }
  };

  const handleDislike = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/dislike/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (isDisliked) {
          setDislikes((prev) => prev - 1); // Undislike
          setIsDisliked(false);
        } else {
          setDislikes((prev) => prev + 1); // Dislike
          if (isLiked) {
            setLikes((prev) => prev - 1); // Remove like if it was liked
          }
          setIsDisliked(true);
          setIsLiked(false);
        }
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Error disliking the post.');
      }
    } catch (error) {
      setMessage('Error disliking the post.');
    }
  };

  const openCommentsModal = () => {
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Title: {title}</h5>
        <p className="card-text">Content: {content}</p>
        <p className="card-text">
          Author:{' '}
          <span
            className="text-primary"
            role="button"
            onClick={() => navigate(`/user/${userId}`)}
          >
            {author}
          </span>
        </p>
        <div className="d-flex flex-column align-items-start">
          <div className="btn-group mb-2">
            <button
              className={`btn ${isLiked ? 'btn-success' : 'btn-outline-success'}`}
              onClick={handleLike}
            >
              Like ({likes})
            </button>
            <button
              className={`btn ${isDisliked ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleDislike}
            >
              Dislike ({dislikes})
            </button>
            <button
              className="btn btn-outline-info"
              onClick={openCommentsModal}
            >
              Show Comments
            </button>
          </div>
          {message && <small className="text-muted">{message}</small>}
          {isCommentsModalOpen && (
            <CommentsModel postId={postId} onClose={closeCommentsModal} />
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Post;
