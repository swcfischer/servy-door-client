import React from "react";

import FadeLoader from "react-spinners/FadeLoader";

import "./loading-spinner.css";

function LoadingSpinner(props) {
  return (
    <div className="fade-in spinner">
      <FadeLoader />
    </div>
  );
}

export default LoadingSpinner;
