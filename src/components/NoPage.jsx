import '../assets/notfound-page.css';
import React from "react";
const NoPage= ()=>{
    return(
<div class="nopage">
        <h2>No Page Found</h2>
        <p>The page you are looking for does not exist. Please check the URL or go back to the homepage.</p>
        <a href="/" class="home-button">Go to Homepage</a>
    </div>
 )
}
export default NoPage;