import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "gatsby";
import Modal from "react-modal";

import { getImageLink } from "../utils/image";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

import styled from "@emotion/styled";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import formatDate from "../utils/formatDate";
import { createGooglePublisherLink } from "../utils/createLinks";
import { renderGoogleAuthorLinks } from "./library/book-details";

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

const Container = styled.div`
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

  .go-back-button {
    margin-left: 0;
  }

  .read-button {
    margin-left: 12px;
  }

  .loading-container {
    min-height: 75vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-style: italic;
    font-weight: 100;
  }

  .image-button {
    background: transparent;
    border: none;
    margin-right: 40px;
    padding: 0;
    border-radius: 3px;

    &:hover {
      opacity: 0.7;
    }
  }

  .image {
    cursor: zoom-in;
    border-radius: 3px;
    display: block;
  }

  .description {
    max-width: 450px;
    float: left;
  }
`;
function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");
  const isModal = Boolean(params.get("isModal"));

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  const [state, setState] = useState({});

  const [modalIsOpen, setModalIsOpen] = useState(isModal);

  const [readModalIsOpen, setReadModalIsOpen] = useState(false);
  const [weeks, setWeeks] = useState("");
  const [motivation, setMotivation] = useState("");

  const handleMotivationChange = (event) => {
    setMotivation(event.target.value);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const handleWeeksChange = (event) => {
    setWeeks(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log(`Weeks: ${weeks}`);
  };

  useEffect(() => {
    async function fetchBook() {
      setIsLoading(true);
      const response = await axios.get(bookGet + id);
      const img = await getImageLink(response.data.volumeInfo.imageLinks);

      setState({
        ...response.data,
        img,
      });

      setIsLoading(false);
    }
    Modal.setAppElement("body");
    if (id) {
      fetchBook();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Container className="fade-in">
      <button
        className="go-back-button"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Go Back
      </button>
      <button
        className="read-button"
        onClick={(e) => {
          e.preventDefault();
          setReadModalIsOpen(true);
        }}
      >
        Read
      </button>
      <h1
        style={{
          fontStyle: "italic",
          fontWeight: "100",
        }}
      >
        {state.volumeInfo.title}
      </h1>
      <div style={{ display: "flex" }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          style={{
            content: {
              position: "relative",
              width: "800px",
              boxSizing: "border-box",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              maxHeight: "100vh",
              background: "#000",
              inset: 0,
              padding: 0,
              overflow: "auto",
              maxWidth: "100%",
            },
            overlay: {
              background: "rgba(0,0,0,.9)",
              backdropFilter: "blur(8px)",
            },
          }}
        >
          <button className="modal-close-button" onClick={closeModal}>
            Close
          </button>
          <img
            src={state.img.image}
            alt=""
            style={{
              ...getImageDimensions(state),
              marginTop: "12px",
            }}
          />
        </Modal>

        <div>
          <button
            className="image-button"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                openModal();
              }
            }}
            onClick={openModal}
            tabIndex={0}
          >
            <img
              width="200px"
              height={`${(state.img.height / state.img.width) * 200}px`}
              className="image"
              src={state.img.image}
              alt=""
            />
          </button>
          <dl style={{ maxWidth: "210px" }}>
            {state.volumeInfo.authors && (
              <>
                <dt>Author{state.volumeInfo.authors?.length > 1 && "s"} </dt>
                <dd>{renderGoogleAuthorLinks(state.volumeInfo?.authors)}</dd>
              </>
            )}
            <dt>Publisher</dt>
            <dd>
              <a
                target="_blank"
                href={createGooglePublisherLink(state.volumeInfo?.publisher)}
              >
                {state.volumeInfo?.publisher}
              </a>
            </dd>
            <dt>Date Published</dt>
            <dd>{formatDate(state.volumeInfo.publishedDate)}</dd>
            <dt>Page Count</dt>
            <dd>{state.volumeInfo.pageCount}</dd>
            <dt>Preview Link</dt>
            <dd>
              <a
                href={state.volumeInfo.previewLink}
                rel="noreferrer"
                target="_blank"
              >
                Here
              </a>
            </dd>
            <dt>Info Link</dt>
            <dd>
              <a
                href={state.volumeInfo.infoLink}
                rel="noreferrer"
                target="_blank"
              >
                Here
              </a>
            </dd>
          </dl>
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: state.volumeInfo.description }}
          className="description"
        ></p>
      </div>
      <Modal
        isOpen={readModalIsOpen}
        onRequestClose={() => {
          setReadModalIsOpen(false);
        }}
        contentLabel="Image Modal"
        style={{
          content: {
            maxWidth: "600px",
            margin: "auto",
          },
          overlay: {
            backdropFilter: "blur(1px)",
          },
        }}
      >
        <button
          className="read-modal-close-button"
          onClick={() => {
            setReadModalIsOpen(false);
          }}
        >
          Close
        </button>
        <div>
          <h2 style={{ fontWeight: "normal", fontStyle: "italic" }}>
            How many weeks do you want to spend reading {state.volumeInfo.title}
            ?
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={weeks}
              onChange={handleWeeksChange}
              min="0"
              placeholder="Weeks"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                boxSizing: "border-box",
                border: "1px solid black",
                borderRadius: "4px",
              }}
            />

            {weeks && (
              <p>
                You need to read approximately{" "}
                <strong>
                  {Math.ceil(state.volumeInfo.pageCount / (weeks * 7))} pages
                  per day.
                </strong>
              </p>
            )}

            {weeks && (
              <>
                <h2 style={{ fontWeight: "normal", fontStyle: "italic" }}>
                  Motivation for reading {state.volumeInfo.title}
                </h2>
                <input
                  type="text"
                  value={motivation}
                  onChange={handleMotivationChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    margin: "10px 0",
                    boxSizing: "border-box",
                    border: "1px solid black",
                    borderRadius: "4px",
                  }}
                />
              </>
            )}

            {weeks && (
              <button
                type="submit"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={async (e) => {
                  try {
                    const { data } = await axiosInstance.post(
                      "/books/create-book/" + user.uuid,
                      {
                        title: state.volumeInfo.title,
                        image: state.img.image,
                        weeks: weeks,
                        volumeInfo: state.volumeInfo,
                        pageCount: state.volumeInfo.pageCount,
                        infoLink: state.volumeInfo.infoLink,
                        previewLink: state.volumeInfo.previewLink,
                        publisher: state.volumeInfo.publisher,
                        datePublished: state.volumeInfo.publishedDate,
                        author: state.volumeInfo.authors.join(", "),
                        motivation: motivation, // Add the motivation value if available
                        summary: state.volumeInfo.description,
                      }
                    );
                    navigate("/library/book-details?id=" + data.uuid);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </Modal>
    </Container>
  );
}

export default Book;

function getImageDimensions(state) {
  const maxWidth = 600;
  const ratio = state.img.width / state.img.height;

  if (state.img.width > maxWidth) {
    return {
      width: maxWidth,
      height: maxWidth / ratio,
    };
  }

  return {
    width: state.img.width,
    height: state.img.height,
  };
}
