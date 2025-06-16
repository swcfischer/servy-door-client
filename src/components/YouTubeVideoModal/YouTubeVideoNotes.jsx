import React, { useRef } from "react";
import Modal from "react-modal";
import axiosInstance from "../../axiosInstance";
import ReactPlayer from "react-player";
import ActionButton from "../BookDetails/ActionButton";
import getOS from "../../utils/getOS";
import { navigate } from "gatsby";
import { videoStyles } from "./YouTubeVideoModal";
import styled from "@emotion/styled";

const Container = styled.div`
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
  .notes-header {
    display: flex;
    justify-content: flex-end;
  }

  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }
`;

export default function YouTubeVideoNotes(props) {
  const { isOpen, handleRequestClose, video, user, id } = props;

  const textArea = useRef(null);
  const handleSave = () => {};

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      contentLabel="YouTube Video Modal"
      style={videoStyles}
    >
      <Container>
        <h3>{video.title}</h3>
        <ReactPlayer url={video.url} controls width="100%" />
        <button className="close-btn" onClick={handleRequestClose}>
          Close
        </button>

        <div className="notes-section">
          <div className="notes-header">
            <ActionButton
              options={[
                {
                  label: "Delete Video",
                  action: async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to remove this book from your library?"
                    );
                    if (!confirmDelete) {
                      return;
                    }

                    try {
                      await axiosInstance.delete(
                        `/books/book/${user.uuid}?id=${id}`
                      );
                      // Redirect or update state after deletion
                      navigate("/library");
                    } catch (err) {
                      console.error(
                        "There was an error deleting the book!",
                        err
                      );
                    }
                  },
                },
              ]}
            />
          </div>
          <textarea
            ref={textArea}
            rows="10"
            cols="50"
            spellCheck="false"
            onKeyDown={(event) => {
              const os = getOS();

              const isWindows = os === "Windows";
              const isMac = os === "macOS";

              const isSaveShortcut =
                (event.metaKey && event.key === "s" && isMac) ||
                (event.ctrlKey && event.key === "s" && isWindows);

              if (isSaveShortcut) {
                handleSave(); // Call your save function
                event.preventDefault(); // Prevent the default browser save action
              }
            }}
            onChange={(e) => {
              // * state management necessary
            }}
            placeholder="Write your notes here..."
            value={""}
            style={{ resize: "none" }}
          ></textarea>
        </div>
        <div className="button-container">
          <button onClick={handleSave} style={{ marginRight: "12px" }}>
            Save Notes
          </button>
        </div>
      </Container>
    </Modal>
  );
}
