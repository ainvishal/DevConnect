import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const currentUsername = localStorage.getItem('username');

      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/get', { // Adjust URL to your backend endpoint
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Filter out the current logged-in user
          const filteredUsers = data.filter(user => user.username !== currentUsername);
          setUsers(filteredUsers);
          setLoading(false);
        } else {
          setError('Error fetching users.');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
          <button
        className="btn btn-secondary"
        onClick={() => navigate('/home')}
      >
        Go Back
      </button>
      <h2 className="text-center mb-4">Users</h2>
      <div className="list-group">
        {users.map((user) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={user.id}>
            <p>{user.username}</p>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate(`/user/${user.id}`)}  // Navigate to user profile
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
