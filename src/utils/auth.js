import axiosInstance from "../axiosInstance";

// OAuth helper functions
export const redirectToGoogleAuth = () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://servy-door-server.onrender.com"
      : "http://localhost:8888";

  window.location.href = `${baseURL}/auth/google`;
};

export const handleOAuthCallback = async (token, setUser) => {
  if (!token) {
    throw new Error("No token provided");
  }

  // Store the token
  localStorage.setItem("token", token);
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Fetch current user info
  const response = await axiosInstance.get("/users/current_user");

  if (!response.data.currentUser) {
    throw new Error("User not found");
  }

  setUser({
    ...response.data.currentUser,
    isLoading: false,
  });

  return response.data.currentUser;
};

export const linkGoogleAccount = async () => {
  try {
    const response = await axiosInstance.post("/auth/link-google");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to link Google account"
    );
  }
};

export const unlinkGoogleAccount = async () => {
  try {
    const response = await axiosInstance.post("/auth/unlink-google");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to unlink Google account"
    );
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Logout function
export const logout = (setUser) => {
  localStorage.removeItem("token");
  delete axiosInstance.defaults.headers.common["Authorization"];
  setUser({ isLoading: false });
};

// Get user from token without API call
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // This is a simple decode - in production you'd want to validate the token
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
