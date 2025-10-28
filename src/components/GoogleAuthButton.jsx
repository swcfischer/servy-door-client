import React, { useContext } from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import axiosInstance from "../axiosInstance";
import { UserContext } from "./Layout";

const GoogleButtonContainer = styled.div`
  .google-login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #3c4043;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;

    &:hover {
      background-color: #f8f9fa;
      box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #4285f4;
    }
  }

  .user-avatar-link {
    display: flex;
    align-items: center;
    text-decoration: none;

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #5e5e5e;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(94, 94, 94, 0.4);
      }
    }

    .user-initial {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #4caf50;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      border: 2px solid #5e5e5e;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(94, 94, 94, 0.4);
      }
    }
  }

  .google-icon {
    margin-right: 8px;
    width: 18px;
    height: 18px;
  }
`;

const GoogleAuthButton = ({ text = "Sign in" }) => {
  const { user } = useContext(UserContext);

  // Show avatar link if user is authenticated (not anonymous)
  if (!user.isLoading && user.status !== "anonymous" && user.googleId) {
    const userInitial = (user.accountName || user.email || "U")
      .charAt(0)
      .toUpperCase();

    return (
      <GoogleButtonContainer>
        <Link to="/account" className="user-avatar-link">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="user-avatar"
              title={`Logged in as ${user.accountName || user.email}`}
            />
          ) : (
            <div
              className="user-initial"
              title={`Logged in as ${user.accountName || user.email}`}
            >
              {userInitial}
            </div>
          )}
        </Link>
      </GoogleButtonContainer>
    );
  }

  // Don't show anything if loading
  if (user.isLoading) {
    return null;
  }

  const handleLogin = () => {
    // Redirect to server's Google OAuth endpoint
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
  };

  return (
    <GoogleButtonContainer>
      <button className="google-login-button" onClick={handleLogin}>
        <svg
          className="google-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
              fill="#4285F4"
              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
              fill="#34A853"
              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
              fill="#FBBC05"
              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
              fill="#EA4335"
              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
            />
          </g>
        </svg>
        {text}
      </button>
    </GoogleButtonContainer>
  );
};

export default GoogleAuthButton;
