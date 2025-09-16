// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ user, searchQuery, setSearchQuery }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const handleProfileOption = (option) => {
    if (option === "view-profile") navigate("/admin/dashboard/profile");
    if (option === "logout") {
      localStorage.clear();
      navigate("/login");
    }
   setShowDropdown(false);
  };
  return (
    <header className="header">
      {/* Search */}
      <div className="searchbar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      {/* Profile */}
      <div className="user-profile">
          {user?.profile && (
          <img 
            src={`http://localhost:8002/${user.profile}?t=${Date.now()}`}
            className="dpicn-icon"
            width="50"
            height="50"
            alt="profile"
            onClick={toggleDropdown}
            />
          )}
        {/* <img src={
            user?.profile
              ? `http://localhost:8002/${user.profile}?t=${Date.now()}`
              : "http://localhost:8002/uploads/images/Signup-1741170871891.png"}
          className="dpicn-icon"
          width="50"
          height="50"
          alt="profile"
          onClick={toggleDropdown}
        /> */}
        {showDropdown && (
          <div className="dropdown-menu">
            <p onClick={()=> handleProfileOption("view-profile")}>
              Edit Profile
            </p>
            <p onClick={()=> handleProfileOption("logout")}>Logout</p>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
