import React, { useState, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import ReactPlayer from "react-player";
import Modal from "react-modal";
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
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        padding: 8px;
        position: relative;
        border: 1px solid transparent;

        &:hover {
          background-color: #0000001c;
          border: 1px solid #222;
        }

        &.watched {
          opacity: 0.6;

          &::after {
            content: "✓ Watched";
            position: absolute;
            top: 8px;
            right: 8px;
            background: #28a745;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
          }
        }
        .video-content {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .thumbnail {
          width: 240px;
          height: 180px;
          object-fit: cover;
          border-radius: 3px;
          flex-shrink: 0;
          filter: grayscale(0.5);
        }

        .video-info {
          flex: 1;

          .video-title {
            font-size: 18px;
            font-weight: 500;
            color: #333;
            line-height: 1.3;
            margin-bottom: 4px;
          }

          .video-author {
            font-size: 16px;
            color: #6c757d;
          }
        }
      }
    }
  }
`;

const ModalStyles = {
  content: {
    position: "fixed",
    top: "5vh",
    left: "5vw",
    right: "5vw",
    bottom: "5vh",
    margin: 0,
    background: "#000",
    width: "90vw",
    height: "90vh",
    maxWidth: "none",
    maxHeight: "none",
    overflow: "hidden",
    border: "none",
  },
  overlay: {
    background: "rgba(0,0,0,.9)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const ModalContent = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .video-player-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .react-player {
      width: 100% !important;
      height: 100% !important;
    }
  }

  button {
    height: max-content;
    padding: 11px 20px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #555;
    }
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
  }
`;

// Decode common HTML entities (YouTube titles sometimes include these)
const decodeHtml = (str = "") =>
  str
    // hex numeric refs
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    // decimal numeric refs
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    // named entities
    .replace(/&quot;/g, '"')
    .replace(/&(apos|#39);/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function YouTubeSearch({ defaultQuery = "", maxResults = 5 }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState(new Set());

  // Load watched videos from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("watchedVideos");
    if (stored) {
      setWatchedVideos(new Set(JSON.parse(stored)));
    }
  }, []);

  // Check if a video has been watched more than 50%
  const isVideoWatched = (videoId) => {
    return watchedVideos.has(videoId);
  };

  // Track video progress and mark as watched if over 50%
  const handleVideoProgress = (progress) => {
    if (!selectedVideo) return;

    const { played } = progress;
    if (played > 0.5 && !watchedVideos.has(selectedVideo.videoId)) {
      const newWatchedVideos = new Set(watchedVideos);
      newWatchedVideos.add(selectedVideo.videoId);
      setWatchedVideos(newWatchedVideos);

      // Save to localStorage
      localStorage.setItem(
        "watchedVideos",
        JSON.stringify([...newWatchedVideos])
      );
      console.log(
        `Video ${selectedVideo.videoId} marked as watched (${Math.round(
          played * 100
        )}% progress)`
      );
    }
  };

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

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
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
        <h3>Relevant YouTube Videos</h3>
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

        {results && !loading && (
          <>
            {results.videos?.length > 0 ? (
              <div className="video-list">
                {results.videos.map((video) => (
                  <div
                    key={video.videoId}
                    className={`video-item ${
                      isVideoWatched(video.videoId) ? "watched" : ""
                    }`}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="video-content">
                      <img
                        src={video.thumbnail}
                        alt={decodeHtml(video.title)}
                        className="thumbnail"
                      />
                      <div className="video-info">
                        <div className="video-title">
                          {decodeHtml(video.title)}
                        </div>
                        <div className="video-author">
                          {decodeHtml(video.author)}
                        </div>
                      </div>
                    </div>
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

      {/* Video Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={ModalStyles}
        contentLabel="YouTube Video Player"
      >
        {selectedVideo && (
          <ModalContent>
            <div className="video-player-container">
              <ReactPlayer
                url={selectedVideo.url}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                onProgress={handleVideoProgress}
                className="react-player"
              />
            </div>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
}

export default YouTubeSearch;
