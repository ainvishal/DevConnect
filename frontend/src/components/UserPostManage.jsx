import React, { useState } from 'react';

const UserPostManager = ({ postId, title: initialTitle, author, content: initialContent, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title,  content }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Post updated successfully.');
        setIsEditing(false);
      } else {
        setMessage(data.error || 'Error updating post.');
      }
    } catch (error) {
      setMessage('Error updating post.');
    }
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setMessage('Post deleted successfully.');
        onDelete(postId); // Notify parent component
      } else {
        setMessage('Error deleting post.');
      }
    } catch (error) {
      setMessage('Error deleting post.');
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {isEditing ? (
          <>
            <div className="form-group mb-3">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label>Author</label>
              <textarea
                className="form-control"
                value={author}
                disabled
              />
              </div>
            <div className="form-group mb-3">
              <label>Content</label>
              <textarea
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <button className="btn btn-success" onClick={handleUpdate}>
              Save
            </button>
            <button className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title">Title: {title}</h5>
            <p className="card-text">Author: {author}</p>
            <p className="card-text">Content: {content}</p>
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-danger ms-2" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
        {message && <p className="text-muted mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default UserPostManager;
