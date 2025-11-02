import React, { useState, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import ReactPlayer from "react-player";
import { UserContext } from "../Layout";
import { searchYouTubeVideos } from "../../utils/googleBooksApi";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Container = styled.div`
  .search-section {
    margin-bottom: 12px;

    h3 {
      margin-bottom: 8px;
      color: #333;
      font-size: 16px;
    }
  }

  .results-section {
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60px;
    }

    .error-message {
      color: #dc3545;
      padding: 8px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 12px;
    }

    .no-results {
      text-align: center;
      color: #6c757d;
      padding: 16px;
      font-style: italic;
      font-size: 12px;
    }

    .video-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .video-item {
        .video-player {
          width: 100%;
          margin-bottom: 4px;
          border-radius: 3px;
          overflow: hidden;
        }

        .video-title {
          font-size: 11px;
          font-weight: 500;
          color: #333;
          line-height: 1.2;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-author {
          font-size: 10px;
          color: #6c757d;
        }
      }
    }
  }
`;

function YouTubeSearch({ defaultQuery = "", maxResults = 5 }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const performSearch = async (searchQuery) => {
    console.log("performSearch called with:", searchQuery);

    if (!searchQuery.trim()) {
      console.log("No search query provided");
      setError("No search query provided");
      return;
    }

    if (!user?.uuid) {
      console.log("User not logged in");
      setError("Please log in to search YouTube videos");
      return;
    }

    console.log("Starting YouTube search...");
    setLoading(true);
    setError("");

    try {
      const response = await searchYouTubeVideos(
        user.uuid,
        searchQuery.trim(),
        maxResults
      );
      console.log("YouTube search response:", response);
      setResults(response);
    } catch (err) {
      console.error("YouTube search error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to search YouTube videos. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically search when component mounts or defaultQuery changes
  useEffect(() => {
    console.log("YouTubeSearch useEffect triggered:", {
      defaultQuery,
      userUuid: user?.uuid,
      maxResults,
    });
    if (defaultQuery && user?.uuid) {
      console.log("Performing search with query:", defaultQuery);
      performSearch(defaultQuery);
    }
  }, [defaultQuery, user?.uuid, maxResults]);

  return (
    <Container>
      <div className="search-section">
        <h3>Related YouTube Videos</h3>
        {/* Debug button in development */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={() => performSearch(defaultQuery)}
            style={{
              fontSize: "10px",
              padding: "4px 8px",
              marginBottom: "8px",
            }}
          >
            Retry Search
          </button>
        )}
      </div>

      <div className="results-section">
        {loading && (
          <div className="loading-container">
            <LoadingSpinner />
            <div style={{ marginLeft: "8px", fontSize: "12px" }}>
              Loading videos...
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Debug info */}
        {process.env.NODE_ENV === "development" && (
          <div style={{ fontSize: "10px", color: "#999", marginBottom: "8px" }}>
            Debug: Query="{defaultQuery}", User=
            {user?.uuid ? "logged in" : "not logged in"}, Results=
            {results?.videos?.length || 0}
          </div>
        )}

        {results && !loading && (
          <>
            {results.videos?.length > 0 ? (
              <div className="video-list">
                {results.videos.map((video) => (
                  <div key={video.videoId} className="video-item">
                    <ReactPlayer
                      url={video.url}
                      width="100%"
                      //   height="120px"
                      controls={false}
                      className="video-player"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                No videos found for "{results.query}".
              </div>
            )}
          </>
        )}

        {!loading && !error && !results && (
          <div
            style={{
              fontSize: "12px",
              color: "#999",
              padding: "16px",
              textAlign: "center",
            }}
          >
            Waiting for search...
          </div>
        )}
      </div>
    </Container>
  );
}

export default YouTubeSearch;
