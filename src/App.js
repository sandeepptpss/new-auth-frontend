import React from "react";
import './custom.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import Router from './routes/router';

const GOOGLE_CLIENT_ID = "407167276121-h9ohple7698t3ntdrf2gltlukbol1jvk.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="outer-main-component App">
        <Router />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
