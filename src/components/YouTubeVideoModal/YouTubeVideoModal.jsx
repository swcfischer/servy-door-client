import React, { useContext, useState, useRef } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../Layout";
import ReactPlayer from "react-player";
import ActionButton from "../BookDetails/ActionButton";
import getOS from "../../utils/getOS";
import { navigate } from "gatsby";
// import { removeHtmlTags } from "../../utils/capitalizeFirstLetter";
// import ReactMarkdown from "react-markdown";

Modal.setAppElement("body");

const customStyle = {
  content: {
    position: "fixed",
    top: 100,
    height: "min-content",
    boxSizing: "border-box",
    margin: "16vh auto auto auto",
    background: "#fafafa",
    maxWidth: "500px",
    maxHeight: "100vh",
    overflowY: "auto",
  },
  overlay: {
    background: "rgba(0,0,0,.9)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const videoStyles = {
  ...customStyle,
  content: {
    ...customStyle.content,
    top: 0,
    margin: "auto",
    maxWidth: 800,
    margin: "2vh auto auto auto",
  },
};

const Container = styled.div`
  position: relative;
  margin-top: 12px;
  padding-top: 12px;

  h2 {
    text-align: center;
  }
  form.form-container {
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .field-container {
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 32px;

      label {
        padding-bottom: 8px;
        font-weight: bold;

        .is-required {
          color: red;
        }
      }

      .form-field {
        padding-bottom: 12px;
        font-family: inherit;
        padding: 6px;
        font-size: 16px;
      }
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
    margin-top: 12px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #555;
    }
  }

  .submit-btn {
    width: 100%;
  }
  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }
`;

export const FORM = "FORM";
export const VIDEO_VIEW = "VIDEO_VIEW";

function YouTubeVideoModal({
  isOpen,
  onRequestClose,
  setVideos,
  bookUuid,
  googleId,
  formState = FORM,
}) {
  const [curState, setCurState] = useState(formState);
  const [video, setVideo] = useState(null);
  const { user } = useContext(UserContext);

  const textArea = useRef(null);
  const id = "123";
  const handleSave = () => {};

  const validationSchema = Yup.object({
    url: Yup.string()
      .url("Please enter a valid URL")
      .required("URL is required"),
  });

  const handleRequestClose = () => {
    // setCurState(FORM);
    // setDefinition("");
    onRequestClose();
  };

  if (curState === VIDEO_VIEW) {
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
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      contentLabel="YouTube Video Modal"
      style={customStyle}
    >
      <Container>
        <h2>YouTube Video</h2>

        <Formik
          initialValues={{ url: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const { data } = await axiosInstance.post(
              `/book-video/create-video/${user?.uuid}/${bookUuid}`,
              {
                bookUuid,
                googleId,
                url: values.url,
              }
            );

            setVideo(data);
            setVideos((prev) => {
              return [data, ...prev];
            });
            setCurState(VIDEO_VIEW);
            resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form-container">
              <div className="field-container">
                <label htmlFor="url">
                  YouTube Video URL<span className="is-required"> *</span>
                </label>
                <Field
                  className="form-field"
                  name="url"
                  type="text"
                  autoFocus
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="url"
                  style={{
                    color: "red",
                    position: "absolute",
                    bottom: 10,
                    left: 0,
                  }}
                />
              </div>
              <button
                className="submit-btn"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <button className="close-btn" onClick={handleRequestClose}>
          Close
        </button>
      </Container>
    </Modal>
  );
}

export default YouTubeVideoModal;
