import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the Post component
import UserPostManager from './UserPostManage';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    const accessToken = localStorage.getItem('accessToken');  // Get the token from local storage
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // Send token in the header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setLoading(false);
        // Process the posts data here
      } else {
        const data = await response.json();
        console.error(data.error || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };
  



  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">  
    <div className="mb-4">  
      <button
        className="btn btn-primary me-3"  
        onClick={() => navigate('/add-post')}
      >
        Create New Post
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => navigate('/home')}
      >
        Go Back
      </button>
    </div>
  
    <h2 className="mb-4">Your Posts</h2>  {/* Added bottom margin to the title */}
  
    {posts.length === 0 ? (
      <p>You haven't created any posts yet.</p>
    ) : (
      posts.map((post) => (
        <div key={post.id} className="mb-4">  {/* Added bottom margin to each post */}
          <UserPostManager
            postId={post.id}
            title={post.title}
            author={post.author}
            content={post.content}
          />
        </div>
      ))
    )}
  </div>
  
  );
};

export default UserPosts;
