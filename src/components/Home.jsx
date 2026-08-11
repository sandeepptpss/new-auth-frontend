import React from "react";
const Home =()=>{
    return(
        <div className="main-home-page">
<section class="hero">
        <h1>Welcome to MyWebsite</h1>
        <p>Your one-stop solution for modern web design.</p>
        <button  class="btn">Get Started</button>
    </section>
    
    <section class="content">
        <div class="card">
            <h2>Feature 1</h2>
            <p>Details about the feature.</p>
        </div>
        <div class="card">
            <h2>Feature 2</h2>
            <p>Details about the feature.</p>
        </div>
        <div class="card">
            <h2>Feature 3</h2>
            <p>Details about the feature.</p>
        </div>
    </section>
        </div>
    )
}
export default Home;