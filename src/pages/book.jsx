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
import { buildQueryParams } from "../utils/queryFunctions";
import AuthorModal from "../components/AuthorModal/AuthorModal";
import { getGoogleBook } from "../utils/googleBooksApi";
import { BsStars } from "react-icons/bs";
import { TfiYoutube } from "react-icons/tfi";
import { FcKindle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import { FaAmazon } from "react-icons/fa";

// import YouTubeSearch from "../components/YouTubeSearch/YouTubeSearch";
// import BookComments from "../components/BookComments/BookComments";

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

const SummarizeBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${(p) =>
    p.isSummarized ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.2)"};
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  border: none;
  color: #d4c066;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.55);
  }

  svg {
    font-size: 20px;
  }
`;

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
      padding: 8px 12px;
      font-size: 16px;
      border-radius: 3px;
      border: 1px solid #5e5e5e;
      background-color: #222;
      color: #d4c066;
      cursor: pointer;
      margin-top: 12px;
      transition: all 0.3s ease;
      font-family: inherit;

      &:hover {
        background-color: #333;
        border-color: #7e7e7e;
      }

      &:focus {
        outline: 2px solid #d4c066;
        outline-offset: 2px;
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
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 3px;
    border: 1px solid #5e5e5e;
    background-color: #222;
    color: #d4c066;
    cursor: pointer;
    margin-top: 12px;
    transition: all 0.3s ease;
    font-family: inherit;
    margin-bottom: 36px;

    &:hover {
      background-color: #333;
      border-color: #7e7e7e;
    }

    &:focus {
      outline: 2px solid #d4c066;
      outline-offset: 2px;
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

  .icon-links-container {
    ul {
      display: flex;
      list-style: none;
      margin: 0 auto;
      padding: 12px;
      max-width: 70%;
      justify-content: space-between;

      li {
        svg {
          fill: #222;
          font-size: 26px;
        }
      }
    }
  }

  .description-container {
    position: relative;

    width: max-content;
    margin: 0 auto;

    .summarize-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.2);
      padding: 8px;
      border-radius: 3px;
      cursor: pointer;

      svg {
        font-size: 20px;
      }
    }

    .description {
      max-width: 450px;
      float: left;
      font-size: 18px;
      padding: 76px 24px 24px 24px;
      box-sizing: border-box;
      background: #d4aa01;
      margin: 0;
      border: 1px solid #1e1902;
      border-radius: 3px;

      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: #1e1e1e;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 8px;
        border: 2px solid #1e1e1e;
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: #666;
      }
    }
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

export const READING_COMMENTS = "READING_COMMENTS";
export const WRITING_COMMENT = "WRITING_COMMENT";

function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [commentState, setCommentState] = useState(READING_COMMENTS);

  // const handleLeaveComment = () => {
  //   setCommentState(WRITING_COMMENT);
  // };

  // const handleReadComments = () => {
  //   setCommentState(READING_COMMENTS);
  // };

  const [state, setState] = useState({});
  // Summary toggle state
  const [isSummarized, setIsSummarized] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("summarizeDescriptionGlobal") === "true";
  });
  const [summaryHtml, setSummaryHtml] = useState("");
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);

  async function fetchSummary(originalHtml) {
    if (!originalHtml || !user?.uuid) return;
    setIsFetchingSummary(true);
    try {
      // Scaffolded endpoint: adjust when backend implements summarization
      // Expected response shape: { summary: string }
      const { data } = await axiosInstance.post(
        `/books/summarize-description/${user.uuid}`,
        {
          googleVolumeId: state.id,
          descriptionHtml: originalHtml,
        }
      );
      const raw = data?.summary || "";
      const safe = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      setSummaryHtml(safe);
    } catch (err) {
      console.error("Summary fetch failed:", err);
      // Fallback simple client-side sentence trim (only in browser)
      if (typeof document !== "undefined") {
        const temp = document.createElement("div");
        temp.innerHTML = originalHtml;
        const text = (temp.textContent || "").replace(/\s+/g, " ").trim();
        const sentences = text
          .match(/[^.!?]+[.!?]?/g)
          ?.map((s) => s.trim()) || [text];
        const first = sentences.slice(0, 3).join(" ");
        const fallback = first + (sentences.length > 3 ? " ..." : "");
        setSummaryHtml(
          fallback
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        );
      }
    } finally {
      setIsFetchingSummary(false);
    }
  }

  useEffect(() => {
    async function fetchBook() {
      setIsLoading(true);
      try {
        let response;

        // Use authenticated API if user has Google OAuth
        if (user?.uuid && user?.googleId && !user.isLoading) {
          response = await getGoogleBook(user.uuid, id);
        } else {
          // Fallback to public API
          const publicResponse = await axios.get(bookGet + id);
          response = publicResponse.data;
        }

        const img = await getImageLink(response.volumeInfo.imageLinks);

        setState({
          ...response,
          img,
        });
      } catch (error) {
        console.error("Error fetching book:", error);

        // Fallback to public API if authenticated request fails
        if (error.response?.status === 401) {
          try {
            const publicResponse = await axios.get(bookGet + id);
            const response = publicResponse.data;
            const img = await getImageLink(response.volumeInfo.imageLinks);
            setState({
              ...response,
              img,
            });
          } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    Modal.setAppElement("body");
    if (id) {
      fetchBook();
    }
  }, [id, user?.uuid, user?.googleId, user?.isLoading]);

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

  // Trigger summary fetch when toggled on and not yet fetched
  useEffect(() => {
    if (isSummarized && !summaryHtml && state.volumeInfo?.description) {
      fetchSummary(state.volumeInfo.description);
    }
  }, [isSummarized, summaryHtml, state.volumeInfo?.description]);

  // Persist toggle value
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "summarizeDescriptionGlobal",
        isSummarized ? "true" : "false"
      );
    }
  }, [isSummarized]);

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
              label: "Search Author",
              action: () => {
                // * I need to find the next
                // * We need to check whether there are multiple authors, if so show a modal to select the next piece.
                if (state.volumeInfo?.authors?.length > 1) {
                  // * Show modal
                  setIsAuthorModalOpen(true);
                } else {
                  navigate(
                    `/?${buildQueryParams({
                      q: state.volumeInfo?.authors?.join(", "),
                      page: 1,
                      searchFilter: "author",
                    })}`
                  );
                }
              },
            },
            {
              label: "Search Publisher",
              action: () => {
                navigate(
                  `/?${buildQueryParams({
                    q: state.volumeInfo.publisher,
                    page: 1,
                    searchFilter: "publisher",
                  })}`
                );
              },
            },
            {
              label: "Copy JSON",
              action: () => {
                navigator.clipboard.writeText(JSON.stringify(state));

                setSnackbarMessage("Google Volume JSON Copied to Clipboard");
                setSnackbarOpen(true);
              },
            },
            // { isMenuDivider: true },
            // {
            //   label: "Translate to Spanish",
            //   action: async () => {
            //     const summary = state.volumeInfo?.description || "";
            //     if (!summary) {
            //       return;
            //     }

            //     // * Do translation logic
            //     // * Call api, passing in summary
            //     // * And set state

            //     const { data } = await axiosInstance.get(
            //       `/books/translate-summary/${user.uuid}?summary=${summary}&lang=Spanish`
            //     );

            //     setState((prev) => ({
            //       ...prev,
            //       volumeInfo: {
            //         ...prev.volumeInfo,
            //         description: data.text,
            //       },
            //     }));
            //   },
            // },
            // {
            //   label: "Translate to French",
            //   action: async () => {
            //     const summary = state.volumeInfo?.description || "";
            //     if (!summary) {
            //       return;
            //     }

            //     // * Do translation logic
            //     // * Call api, passing in summary
            //     // * And set state

            //     const { data } = await axiosInstance.get(
            //       `/books/translate-summary/${user.uuid}?summary=${summary}&lang=French`
            //     );

            //     setState((prev) => ({
            //       ...prev,
            //       volumeInfo: {
            //         ...prev.volumeInfo,
            //         description: data.text,
            //       },
            //     }));
            //   },
            // },
          ]}
        />
      </div>
      <h1
        style={{
          fontStyle: "italic",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {state.volumeInfo.title}
      </h1>
      <div className="content-container" style={{ display: "flex" }}>
        <div>
          <ExpandableImage state={state} />

          {/* Icons YT, etc */}
          <div className="icon-links-container">
            <ul>
              <li>
                <a
                  href={`https://www.youtube.com/results?search_query=${bookTitle}+${bookAuthor}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TfiYoutube />
                </a>
              </li>
              <li>
                <GoogleBook
                  title={state.volumeInfo.title}
                  author={state.volumeInfo?.authors?.join(", ")}
                  icon={FaGoogle}
                />
              </li>

              <li>
                <a
                  href={state.volumeInfo.previewLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FaGooglePlay />
                </a>
              </li>
              <li>
                <a
                  href={`https://www.amazon.com/s/?k=${bookTitle}+${bookAuthor}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaAmazon />
                </a>
              </li>
            </ul>
          </div>
          <dl style={{ maxWidth: "210px", margin: "0 auto" }}>
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
          </dl>
          {/* <div>
            {commentState === READING_COMMENTS ? (
              <button className="comment-btn" onClick={handleLeaveComment}>
                Comment
              </button>
            ) : (
              <button className="comment-btn" onClick={handleReadComments}>
                Read Comments
              </button>
            )}
          </div> */}
        </div>
        {state.volumeInfo.description && (
          <div className="description-container">
            <SummarizeBtn
              className="summarize-btn"
              isSummarized={isSummarized}
              aria-pressed={isSummarized}
              title={
                isSummarized ? "Show full description" : "Summarize description"
              }
              onClick={() => {
                setIsSummarized((prev) => {
                  const next = !prev;
                  if (!next) {
                    // Clear summary when turning off (optional)
                    setSummaryHtml("");
                  } else if (!summaryHtml) {
                    fetchSummary(state.volumeInfo.description);
                  }
                  return next;
                });
              }}
            >
              {isFetchingSummary ? "..." : <BsStars />}
            </SummarizeBtn>
            <p
              dangerouslySetInnerHTML={{
                __html: isSummarized
                  ? summaryHtml || "Generating summary..."
                  : state.volumeInfo.description,
              }}
              className="description"
            ></p>
          </div>
        )}
      </div>

      {/* YouTube Search Section */}
      {/* {user?.uuid && (
        <YouTubeSearch
          defaultQuery={`${state.volumeInfo?.title || ""} ${
            state.volumeInfo?.authors?.join(" ") || ""
          }`}
          maxResults={8}
        />
      )} */}

      <AuthorModal
        isOpen={isAuthorModalOpen}
        onRequestClose={() => {
          setIsAuthorModalOpen(false);
        }}
        bookUuid={id}
        authorStr={state.volumeInfo?.authors}
      />
      {/* <BookComments commentState={commentState} /> */}

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
