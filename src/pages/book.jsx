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
import ActionButton from "../components/BookDetails/ActionButton";
import { Snackbar } from "@mui/material";
import BookComments from "../components/BookComments/BookComments";

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

const Container = styled.div`
  margin-bottom: 42px;

  .btn-container {
    display: flex;
    justify-content: space-between;

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
      font-family: inherit;

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

  button.comment-btn {
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
    font-family: inherit;

    &:hover {
      background-color: #555;
    }
    margin-bottom: 36px;
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

  @media (max-width: 500px) {
    .content-container {
      flex-direction: column;

      .description {
        max-width: 290px;
        margin: 0 auto;
      }
    }
  }
`;

export const READING_COMMENTS = "reading comments";
export const WRITING_COMMENT = "writing comment";

function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [commentState, setCommentState] = useState(READING_COMMENTS);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLeaveComment = () => {
    setCommentState(WRITING_COMMENT);
  };

  const handleReadComments = () => {
    setCommentState(READING_COMMENTS);
  };

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

  useEffect(() => {
    if (user.uuid && id) {
      async function fetchIsBookmark() {
        try {
          const { data } = await axiosInstance.get(
            "/bookmarks/bookmark/is-bookmark/" + id + "/" + user.uuid
          );
          setIsBookmark(data.isBookmark);
        } catch (err) {
          console.error(err);
        }
      }

      fetchIsBookmark();
      // * Fetch if bookmark, pass in id and userUuid
    }
  }, [user, id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  // * ISBN is important, may need it in the future; however, not at the moment
  // const isbn = state.volumeInfo?.industryIdentifiers?.[0]?.identifier;

  const bookTitle = encodeURIComponent(state.volumeInfo?.title);
  const bookAuthor = encodeURIComponent(state.volumeInfo?.authors?.join(", "));

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
        <ActionButton
          options={[
            {
              label: "Read",
              action: async (e) => {
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
              },
            },
            {
              label: !isBookmark ? "Bookmark" : "Remove Bookmark",
              action: !isBookmark
                ? async () => {
                    try {
                      await axiosInstance.post(
                        "/bookmarks/create-bookmark/" + user.uuid,
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
                      setIsBookmark(true);
                      setSnackbarOpen(true);
                      setSnackbarMessage("Added to List in Library");
                      // if (data.error) {
                      //   return navigate("/library/book-details?id=" + data.uuid);
                      // }
                      // navigate("/library/book-details?id=" + data.uuid);
                    } catch (err) {
                      console.log(err);
                    }
                  }
                : async () => {
                    try {
                      await axiosInstance.delete(
                        "/bookmarks/bookmark/" + user.uuid + "/?id=" + id
                      );

                      setSnackbarMessage("Removed from List in Library");
                      setSnackbarOpen(true);
                      setIsBookmark(false);
                      // if (data.error) {
                      //   return navigate("/library/book-details?id=" + data.uuid);
                      // }
                      // navigate("/library/book-details?id=" + data.uuid);
                    } catch (err) {
                      console.log(err);
                    }
                  },
            },
            { isMenuDivider: true },
            {
              label: "Copy JSON",
              action: () => {
                navigator.clipboard.writeText(JSON.stringify(state));

                setSnackbarMessage("Google Volume JSON Copied to Clipboard");
                setSnackbarOpen(true);
              },
            },
          ]}
        />
      </div>
      <h1
        style={{
          fontStyle: "italic",
          fontWeight: "100",
        }}
      >
        {state.volumeInfo.title}
      </h1>
      <div className="content-container" style={{ display: "flex" }}>
        <div>
          <ExpandableImage state={state} />
          <dl style={{ maxWidth: "210px" }}>
            {state.volumeInfo.authors && (
              <>
                <dt>Author{state.volumeInfo.authors?.length > 1 && "s"} </dt>
                <dd>{renderGoogleAuthorLinks(state.volumeInfo?.authors)}</dd>
              </>
            )}
            {state.volumeInfo?.publisher && (
              <>
                <dt>Publisher</dt>
                <dd>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={createGooglePublisherLink(
                      state.volumeInfo?.publisher
                    )}
                  >
                    {state.volumeInfo?.publisher}
                  </a>
                </dd>
              </>
            )}
            {state.volumeInfo.publishedDate && (
              <>
                <dt>Date Published</dt>
                <dd>{formatDate(state.volumeInfo.publishedDate)}</dd>
              </>
            )}
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
              author={state.volumeInfo?.authors?.join(", ")}
            />
            <dt>Amazon</dt>
            <dd>
              <a
                href={`https://www.amazon.com/s/?k=${bookTitle}+${bookAuthor}`}
                target="_blank"
                rel="noreferrer"
              >
                Here
              </a>
            </dd>
          </dl>
          <div>
            {commentState === READING_COMMENTS ? (
              <button className="comment-btn" onClick={handleLeaveComment}>
                Leave a comment
              </button>
            ) : (
              <button className="comment-btn" onClick={handleReadComments}>
                Read Comments
              </button>
            )}
          </div>
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: state.volumeInfo.description }}
          className="description"
        ></p>
      </div>
      <BookComments commentState={commentState} />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Container>
  );
}

export default Book;
