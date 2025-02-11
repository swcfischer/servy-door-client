import React, { useContext, useEffect, useState } from "react";
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
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import GoogleBook from "../components/GoogleBook";
import HTMLRenderer from "react-html-renderer";

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

const Container = styled.div`
  .btn-container {
    display: flex;

    & > * {
      margin-left: 12px;
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

    .go-back-button {
      margin-left: 0;
    }

    .read-button {
      margin-left: 12px;
    }
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

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

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

  const isbn = state.volumeInfo?.industryIdentifiers[0].identifier;

  const bookTitle = encodeURIComponent(state.volumeInfo.title);
  const bookAuthor = encodeURIComponent(state.volumeInfo.authors.join(", "));

  return (
    <Container className="fade-in">
      <div className="btn-container">
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
          onClick={async (e) => {
            e.preventDefault();
            try {
              const { data } = await axiosInstance.post(
                "/books/create-book/" + user.uuid,
                {
                  googleId: state.id,
                  title: state.volumeInfo.title,
                  image: state.img.image,
                  volumeInfo: state.volumeInfo,
                  pageCount: state.volumeInfo.pageCount,
                  infoLink: state.volumeInfo.infoLink,
                  previewLink: state.volumeInfo.previewLink,
                  publisher: state.volumeInfo.publisher,
                  datePublished: state.volumeInfo.publishedDate,
                  author: state.volumeInfo.authors.join(", "),
                  summary: state.volumeInfo.description,
                }
              );
              if (data.error) {
                return navigate("/library/book-details?id=" + data.uuid);
              }
              navigate("/library/book-details?id=" + data.uuid);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          Read
        </button>
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(state));
              alert("State copied to clipboard!");
            }}
          >
            Copy Data
          </button>
        )}
      </div>
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
            <dt>Preview</dt>
            <dd>
              <a
                href={state.volumeInfo.previewLink}
                rel="noreferrer"
                target="_blank"
              >
                Here
              </a>
            </dd>
            <GoogleBook
              title={state.volumeInfo.title}
              author={state.volumeInfo.authors.join(", ")}
            />
            <dt>Amazon</dt>
            <dd>
              <a
                href={`https://www.amazon.com/s/?k=${bookTitle}+${bookAuthor}`}
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
    </Container>
  );
}

export default Book;
