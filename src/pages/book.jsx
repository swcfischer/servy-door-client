import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "gatsby";
import Modal from "react-modal";
import styled from "@emotion/styled";

import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import { getImageLink } from "../utils/image";
import formatDate from "../utils/formatDate";
import { createGooglePublisherLink } from "../utils/createLinks";
import { renderGoogleAuthorLinks } from "./library/book-details";
import ExpandableImage from "../components/ExpandableImage";

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

  .description {
    max-width: 450px;
    float: left;
  }
`;

function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  const [state, setState] = useState({});

  const [readModalIsOpen, setReadModalIsOpen] = useState(false);
  const [weeks, setWeeks] = useState("");
  const [motivation, setMotivation] = useState("");

  const handleMotivationChange = (event) => {
    setMotivation(event.target.value);
  };

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
        <div>
          <ExpandableImage state={state} />
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
