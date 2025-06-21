import React from "react";
import "./LoadingOverlay.css";

const LoadingOverlay = ({ isLoading, message }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
