// src/components/UserProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/dashbord.css";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8002/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = res.data;

        // Map backend 'verified' to frontend 'isVerified'

        setUser({
          ...profileData,
          isVerified: profileData.verified,
        });

        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          role: profileData.role || "",
        });

        if (profileData.profile) {
          setPreviewUrl(`http://localhost:8002/${profileData.profile}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

// Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Update profile (image + text fields together)
  const handleUpdateProfile = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (selectedFile) data.append("profile", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:8002/api/profile-edit", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUser({
          ...res.data.user,
          isVerified: res.data.user.verified,
        });

        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        });

        if (res.data.user.profile) {
          setPreviewUrl(`http://localhost:8002/${res.data.user.profile}`);
        }

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  if (!user) return <p>Loading user data...</p>;

  return (

    <div className="profile-container">
      <div className="profile-header">
        <h2>{user.name}</h2>
        <button onClick={() => navigate("/admin/dashboard")} className="back-button">
          Back to Dashboard
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image-container">
            <img
              src={
                previewUrl || "http://localhost:8002/uploads/images/default-profile.png"
              }
              alt="Profile"
              className="profile-image"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Role:</label>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              />
            ) : (
              <p>{user.role}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Verified:</label>
            <p>{user.isVerified ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
      <div className="profile-actions">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit Profile
          </button>
        ) : (
          <>
            <button onClick={handleUpdateProfile} className="upload-button">
              Update Profile
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
