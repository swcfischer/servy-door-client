import "./src/global.css";
import React from "react";
import Layout from "./src/components/Layout";

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};

// gatsby-browser.js

export const shouldUpdateScroll = ({
  routerProps: { location },
  prevRouterProps,
  getSavedScrollPosition,
}) => {
  // Example: If the user goes to /preview, do NOT reset scroll
  // Otherwise, allow Gatsby's default behavior

  if (
    location.pathname === "/" &&
    location.search !== prevRouterProps?.location.search &&
    prevRouterProps?.location?.pathname === "/"
  ) {
    return false;
  }

  return true;
};
