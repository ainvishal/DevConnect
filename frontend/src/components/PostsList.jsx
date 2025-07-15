import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/get/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Posts</h2>

      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>
          Go back
        </button>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="row">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              <Post
                postId={post.id}
                title={post.title}
                author={post.author}
                content={post.content}
                userId={post.user}
                likes={post.like_count}
                dislikes={post.dislike_count}
              />
            </div>
          ))
        ) : (
          <p className="text-center">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default PostsList;
