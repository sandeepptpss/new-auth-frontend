import '../assets/resetpassword.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token'); 
  console.log(token)
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8002/api/auth/reset-password?token=${token}`,
        { password }
      );
      console.log({ token }, 'Token sent for password reset');
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Server error');
      setSuccess('');
    }
  };
  return (
    <div className="reset-password-container">
      
      <h2>Reset account password</h2>
      <p>Enter a new password</p>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-input">
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="New Password"
          />
        </div>
        <div className="form-input">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            placeholder="Confirm Password"
          />
        </div>
        <button className="submit-resetpassword" type="submit">Reset Password</button>
      </form>
    </div>
  );
};
export default ResetPassword;
