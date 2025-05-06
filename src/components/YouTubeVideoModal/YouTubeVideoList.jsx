import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "react-modal";
import capitalizeFirstLetter, {
  removeHtmlTags,
} from "../../utils/capitalizeFirstLetter";
import ReactMarkdown from "react-markdown";

Modal.setAppElement("body");

const customStyle = {
  content: {
    position: "fixed",
    top: 100,
    height: "min-content",
    boxSizing: "border-box",
    margin: "auto",
    background: "#fafafa",
    maxWidth: "500px",
    maxHeight: "100vh",
    overflowY: "auto",
    paddingBottom: "42px",
  },
  overlay: {
    background: "rgba(0,0,0,.9)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Container = styled.div`
  text-decoration: none;
  min-width: 100px;
  height: max-content;
  box-sizing: border-box;
  padding-bottom: 60px;

  h3 {
    margin-bottom: 18px;
  }

  .vid-container {
    ol {
      padding-left: 42px;
      margin-top: 2px;
    }

    .vid-item {
      cursor: pointer;
      max-width: 200px;

      .vid-item__btn {
        color: rgba(0, 0, 0, 0.7);
        background: transparent;
        padding: 0;
        text-align: left;
        font-family: inherit;
        max-height: 20px;
        text-overflow: ellipsis; /* Add this */
        white-space: nowrap; /* Prevent text wrapping */
        overflow: hidden; /* Hide overflowing text */
        max-width: 200px; /* Ensure a fixed width for truncation */

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &.selected {
      .word-item__btn {
        text-decoration: underline;
      }
    }
  }
`;

const InnerModalContainer = styled.div`
  position: relative;
  margin-top: 12px;
  padding-top: 12px;
  h2 {
    text-align: center;
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
    margin-top: 12px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #555;
    }
  }

  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }
`;

function YouTubeVideoList(props) {
  const { videos } = props;

  const [selectedDef, setSelectedDef] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (def) => (e) => {
    e.preventDefault();
    setSelectedDef(def);
    setIsOpen(true);
  };

  return (
    <Container>
      <h3 style={{ marginBottom: "8px" }}>Videos</h3>
      <div className="vid-container">
        <div>
          {videos.length > 0 ? (
            <ol reversed>
              {videos.map((vid, idx) => {
                return (
                  <li key={`${vid.title}-${idx}`} className="vid-item">
                    <button
                      onClick={handleClick(vid)}
                      className="vid-item__btn"
                    >
                      {vid.title}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p>Look up a word or phrase using the actions menu above</p>
          )}

          <Modal
            isOpen={isOpen}
            onRequestClose={() => {
              setIsOpen(false);
            }}
            contentLabel="YouTube Video Modal"
            style={customStyle}
          >
            <InnerModalContainer>
              <h2>{capitalizeFirstLetter(selectedDef?.word)}</h2>
              <ReactMarkdown>
                {removeHtmlTags(
                  selectedDef?.definition + selectedDef?.definition
                )}
              </ReactMarkdown>

              <button
                className="close-btn"
                onClick={() => {
                  setSelectedDef(null);
                  setIsOpen(false);
                }}
              >
                Close
              </button>
            </InnerModalContainer>
          </Modal>
        </div>
      </div>
    </Container>
  );
}

export default YouTubeVideoList;
