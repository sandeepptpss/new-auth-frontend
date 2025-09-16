import '../assets/signup.css';
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setProfile(e.target.files[0]);
  };

  const SignUpForm = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Username is required.");
      return;
    }
    if (!gender) {
      setError("Gender is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("password", password);
    if (profile) {
      formData.append("profile", profile);
    }

    let result = await fetch("http://localhost:8002/api/register", {
      method: "POST",
      body: formData,
    });

    result = await result.json();
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 50);
    }
  };

  return (
    <div className='outer-signup-form'>
      <div className="custom-sign-up">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Registration successful! Redirecting to login...</div>}
        <form className="main-input-box" onSubmit={SignUpForm} encType="multipart/form-data">
          <div className='form-input'>
            <input type="text" className="inputBox" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
          </div>
          <div className='form-input'>
            <input type="text" className="inputBox" value={username} onChange={(e) => setUser(e.target.value)} placeholder="Enter Username" />
          </div>
           <div className='form-input'>
            <input type="text" className="inputBox" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Enter Gender" />
          </div> 
         {/* <div className="form-input">
            <select
              className="inputBox"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>  */}
          <div className='form-input'>
            <input type="email" className="inputBox" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
          </div>
          <div className='form-input'>
            <input type="file" onChange={handleImageChange} accept="image/*" placeholder='Upload Profile Image' />
          </div>
          <div className='form-input'>
            <input type="password" className="inputBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
          </div>
          <button type="submit" className="Sign-up-btn btn">Sign Up</button>
          <Link to="/login">Login</Link>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
