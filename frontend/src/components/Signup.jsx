import React, { useState } from 'react';
import { signUpUser } from './api'; // Import sign-up function
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Added email state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Include email in the request
      const data = await signUpUser(username, email, password);// Set the logged-in state to true
      navigate('/'); // Navigate to login page after successful sign-up
      setError(''); // Clear error on successful sign-up
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Sign Up</h2>
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="form-group mt-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-4">
          Sign Up
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
