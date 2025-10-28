import React, { useEffect, useContext } from "react";
import { navigate } from "gatsby";
import { UserContext } from "../components/Layout";
import axiosInstance from "../axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const AuthCallback = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      console.error("OAuth authentication failed:", error);
      navigate("/account?error=oauth_failed");
      return;
    }

    if (token) {
      // Store the token and set authorization header
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Fetch current user info
      axiosInstance
        .get("/users/current_user")
        .then((response) => {
          if (response.data.currentUser) {
            setUser({
              ...response.data.currentUser,
              isLoading: false,
            });
            navigate("/account?success=google_login");
          } else {
            navigate("/account?error=user_not_found");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          navigate("/account?error=fetch_user_failed");
        });
    } else {
      navigate("/account?error=no_token");
    }
  }, [setUser]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <LoadingSpinner />
    </div>
  );
};

export default AuthCallback;
