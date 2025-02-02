import React, { useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "gatsby";
import Modal from "react-modal";
import styled from "@emotion/styled";

import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { getImageLink } from "../utils/image";
import formatDate from "../utils/formatDate";
import { createGooglePublisherLink } from "../utils/createLinks";
import { renderGoogleAuthorLinks } from "./library/book-details";
import ExpandableImage from "../components/ExpandableImage";
import ReadBookModal from "../components/ReadBookModal";
import { bookGet } from "../utils/volumesAPI";

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
  const [readModalIsOpen, setReadModalIsOpen] = useState(false);

  const [state, setState] = useState({});

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
        <ReadBookModal
          readModalIsOpen={readModalIsOpen}
          setReadModalIsOpen={setReadModalIsOpen}
          state={state}
        />
        <p
          dangerouslySetInnerHTML={{ __html: state.volumeInfo.description }}
          className="description"
        ></p>
      </div>
    </Container>
  );
}

export default Book;
