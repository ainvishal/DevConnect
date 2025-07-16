import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  const user = localStorage.getItem('username');
  const mail = localStorage.getItem('email');
  const access = localStorage.getItem('accessToken');

  const [formData, setFormData] = useState({
    username: user,
    email: mail,
    phone: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true); // For initial data fetch

  // Fetch the profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const apiUrl = 'https://devconnectbackend-xfej.onrender.com/api/user/profile/data'; // Replace with your backend URL
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`, // Add the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: user, // Keep username and email from localStorage
            email: mail,
            phone: data.phone || '',
            bio: data.bio || '',
          });
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [user, mail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = 'https://devconnectbackend-xfej.onrender.com/api/user/profile/update'; // Replace with your backend URL
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`, // Add the Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateHome = () => {
    navigate('/home'); // Navigate to the home route
  };

  if (initialLoading) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Profile Page</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            disabled // Make this field non-editable
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            disabled // Make this field non-editable
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-control"
            rows="4"
          ></textarea>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      {message && <div className="alert mt-3">{message}</div>}
      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={handleNavigateHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
