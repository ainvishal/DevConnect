import React, { useState } from 'react';
import { loginUser } from './api'; // import login function
import { useNavigate } from 'react-router-dom';


const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        // Attempt to log in with the provided username and password
        const data = await loginUser(username, password);
    
        // If login is successful, update the login state and navigate to home
        if (data) {
          onLogin(true);
          setError(''); // Clear any existing error messages
          navigate('/home'); // Redirect to the home page
        }
      } catch (err) {
        // Display the error message if login fails
        setError(err.message || 'Invalid credentials');
      }
    };
  
    return (
      <div className="container-lg justify-content-center mt-5 justify">
        <h2 className="text-center mb-4">Login</h2>
  
        {error && <div className="alert alert-danger">{error}</div>}
  
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Login
          </button>
        </form>
  
        <p className="mt-3 text-center">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    );
  };
  
  export default Login;