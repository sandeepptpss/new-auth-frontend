import React from "react";
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";
import { antdThemeConfig } from "./theme/adminTheme";
import Router from './routes/router';

const GOOGLE_CLIENT = "407167276121-h9ohple7698t3ntdrf2gltlukbol1jvk.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
      <ConfigProvider theme={antdThemeConfig}>
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
          <Router />
        </div>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
