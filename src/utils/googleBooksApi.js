import axiosInstance from "../axiosInstance";

/**
 * Check if user needs to re-authenticate with Google
 * @param {Object} error - Error object from API call
 * @returns {boolean} - True if user needs to re-authenticate
 */
function requiresReauth(error) {
  return (
    error.response?.status === 401 &&
    error.response?.data?.requiresReauth === true
  );
}

/**
 * Handle authentication errors and provide user feedback
 * @param {Object} error - Error object from API call
 * @param {string} action - Description of the action that failed
 */
function handleAuthError(error, action = "access Google Books") {
  if (requiresReauth(error)) {
    console.error(
      `Google authentication expired while trying to ${action}. Please sign in again.`
    );

    // You can add a toast notification here or trigger a modal
    // For now, we'll just log it
    if (typeof window !== "undefined") {
      // Optional: Show a notification to the user
      console.warn("Redirecting to Google authentication...");
    }
  }
}

/**
 * Search Google Books API with OAuth authentication
 * @param {string} userUuid - The user's UUID
 * @param {Object} params - Query parameters (q, startIndex, maxResults, etc.)
 * @returns {Promise} - Response from Google Books API
 */
export async function searchGoogleBooks(userUuid, params) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(
      `/google-books/search/${userUuid}?${queryString}`
    );
    return response.data;
  } catch (error) {
    handleAuthError(error, "search books");
    throw error;
  }
}

/**
 * Get a specific book by Google Books volume ID
 * @param {string} userUuid - The user's UUID
 * @param {string} volumeId - Google Books volume ID
 * @returns {Promise} - Book details from Google Books API
 */
export async function getGoogleBook(userUuid, volumeId) {
  try {
    const response = await axiosInstance.get(
      `/google-books/volume/${userUuid}/${volumeId}`
    );
    return response.data;
  } catch (error) {
    handleAuthError(error, "fetch book details");
    throw error;
  }
}

/**
 * Validate user's Google authentication status
 * @returns {Promise} - Validation result
 */
export async function validateGoogleAuth() {
  try {
    const response = await axiosInstance.post("/auth/validate-google-token");
    return response.data;
  } catch (error) {
    console.error(
      "Google auth validation failed:",
      error.response?.data || error.message
    );
    return {
      valid: false,
      requiresReauth: requiresReauth(error),
    };
  }
}

/**
 * Search YouTube videos related to a book or topic
 * @param {string} userUuid - The user's UUID
 * @param {string} query - Search query
 * @param {number} maxResults - Number of results (default 5)
 * @returns {Promise} - Response with YouTube videos
 */
export async function searchYouTubeVideos(userUuid, query, maxResults = 5) {
  console.log("🚀 ~ searchYouTubeVideos ~ query:", query);
  try {
    const response = await axiosInstance.get(
      `/google-books/youtube-search/${userUuid}?q=${encodeURIComponent(
        query
      )}&maxResults=${maxResults}`
    );
    return response.data;
  } catch (error) {
    handleAuthError(error, "search YouTube videos");
    throw error;
  }
}

/**
 * Fallback to public API if user is not authenticated
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response from public Google Books API
 */
export async function searchGoogleBooksPublic(params) {
  const axios = require("axios");
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?${queryString}`
  );
  return response.data;
}
