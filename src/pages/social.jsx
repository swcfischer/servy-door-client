import React from "react";
import SearchForUser from "../features/SearchForUser";

function Recent() {
  return (
    <div>
      <SearchForUser />
      <h1>Recent</h1>
      <ul>
        <li>Recently Viewed</li>
        <li>Recent Reviews</li>
        <li>Recent Video Reviews</li>
      </ul>
    </div>
  );
}

export default Recent;
