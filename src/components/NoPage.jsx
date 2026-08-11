// src/components/NoPage.jsx
import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" size="large" onClick={() => navigate("/")} className="rounded-xl font-bold">
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NoPage;