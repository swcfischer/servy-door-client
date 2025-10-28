import axiosInstance from "../axiosInstance";

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
    // If token expired, user needs to re-authenticate
    if (error.response?.status === 401) {
      console.error("Google OAuth token expired. Please sign in again.");
      // Optionally redirect to re-auth
      // window.location.href = '/auth/google';
    }
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
    if (error.response?.status === 401) {
      console.error("Google OAuth token expired. Please sign in again.");
    }
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
