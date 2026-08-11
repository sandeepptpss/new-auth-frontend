import React from "react";
import { Link } from 'react-router-dom';
const Footer = () => {
    const currentYear = new Date().getFullYear(); 
    return (
        <div className="main-footer">
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>About Us</h3>
                        <p>We are committed to providing the best services to our customers.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>
                            <Link to="/">Home</Link> 
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p>Email: info@tech-prastish.com</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {currentYear} Your Company. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};
export default Footer;