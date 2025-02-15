import React, { useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styled from "@emotion/styled";
import formatDate from "../../utils/formatDate";
import {
  createGoogleAuthorLink,
  createGooglePublisherLink,
} from "../../utils/createLinks";
import { navigate } from "gatsby";
import ActionButton from "../../components/BookDetails/ActionButton";
import ReadingSessionList from "../../components/ReadingSessionList";
import PageRange from "../../components/PageRange";
import { Snackbar } from "@mui/material";

const Container = styled.div`
  .book-details {
    display: flex;

    .img-container {
      display: inline-block;
      margin-right: 24px;

      img {
        padding: 0;
        height: min-content;
        border-radius: 3px;
        border: solid 1px #999;
      }
    }

    .datalist-container {
      position: relative;
      top: -19px;
      left: 0px;
    }
  }
  .notes-section {
    textarea {
      border-radius: 3px;
      border: 1px solid #333;
      padding: 12px;
      box-sizing: border-box;

      width: 100%;
      font-family: inherit;
      font-size: 18px;
      height: 375px;
    }
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      height: min-content;
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

  .button-container {
    display: flex;
    justify-content: space-between;
  }
`;

export function renderGoogleAuthorLinks(authors) {
  return authors?.map((author, idx) => {
    const link = createGoogleAuthorLink(author);
    return (
      <a href={link} target="_blank">
        {author}
        {idx !== authors.length - 1 && (
          <>
            {","}
            <br />
          </>
        )}
      </a>
    );
  });
}

const pagesPerDay = 20;

function BookDetails(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const { user } = useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [book, setBook] = useState({});
  const [readingSessions, setReadingSessions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageRange, setPageRange] = useState([]);
  const [readingSessionIdx, setReadingSessionIdx] = useState(0);

  const textArea = useRef();

  useEffect(() => {
    async function fetchData() {
      const res = await axiosInstance.get(`/books/book/${user.uuid}?id=${id}`);
      const resSession = await axiosInstance.get(
        `/reading-sessions/all/${user.uuid}/${id}`
      );

      if (!resSession.data.length) {
        const _pageRange = [1, pagesPerDay];
        const { data: newReadingSession } = await axiosInstance.post(
          `/reading-sessions/create-reading-session/${user.uuid}/${id}`,
          {
            pageRange: _pageRange,
          }
        );

        setReadingSessions([newReadingSession]);
        setPageRange(_pageRange);
      } else {
        setReadingSessions(resSession.data);
        setPageRange(resSession.data[0].pageRange);
      }

      setBook(res.data);
      setIsLoading(false);
    }
    if (user?.uuid && id) {
      try {
        fetchData();
      } catch (err) {
        console.error("There was an error fetching the book details!", err);
        setIsLoading(false);
      }
      // * Do another API call to get all the readingsessions for this user's book
    }
  }, [user, id]);

  useEffect(() => {
    if (textArea.current) {
      textArea.current.scrollTop = textArea.current.scrollHeight;
    }
  }, [textArea.current, isLoading]);

  useEffect(() => {
    if (readingSessions.length > 0) {
      setPageRange(readingSessions[readingSessionIdx].pageRange);
    }
  }, [readingSessionIdx, readingSessions]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const curSession = readingSessions[readingSessionIdx];

  const handleSave = async (e) => {
    const notes = document.querySelector("textarea").value;
    if (notes.trim() === "") {
      alert("Notes cannot be empty");
      return;
    }

    try {
      await axiosInstance.post(
        `/reading-sessions/save-reading-session/${user.uuid}/${id}`,
        {
          notes: notes,
          sessionUuid: curSession.uuid,
          pageRange,
        }
      );

      const updatedSessions = [...readingSessions];
      updatedSessions[readingSessionIdx] = {
        ...updatedSessions[readingSessionIdx],
        notes: notes,
        pageRange,
      };
      setReadingSessions(updatedSessions);

      setSnackbarMessage("Notes successfully saved.");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("There was an error saving the notes!", err);
      alert("Failed to save notes. Please try again.");
    }
  };

  return (
    <Container>
      <h1>{book.volumeInfo?.title}</h1>

      <div className="book-details">
        {book.volumeInfo?.imageLinks?.thumbnail && (
          <div className="img-container">
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
            />
          </div>
        )}
        <div className="datalist-container">
          <dl>
            {book.volumeInfo?.authors && (
              <>
                <dt>Author{book.volumeInfo?.authors.length > 1 ? "s" : ""}</dt>
                <dd>{renderGoogleAuthorLinks(book.volumeInfo?.authors)}</dd>
              </>
            )}

            <dt>Publisher</dt>
            <dd>
              <a
                target="_blank"
                href={createGooglePublisherLink(book.volumeInfo?.publisher)}
              >
                {book.volumeInfo?.publisher}
              </a>
            </dd>

            <dt>Published Date</dt>
            <dd>{formatDate(book.volumeInfo?.publishedDate)}</dd>
            {book?.volumeInfo?.pageCount && (
              <>
                <dt>Page Count</dt>
                <dd>{book?.volumeInfo?.pageCount}</dd>
              </>
            )}
          </dl>

          <details>
            <summary>Description</summary>
            <p
              dangerouslySetInnerHTML={{
                __html: book.volumeInfo?.description,
              }}
            ></p>
          </details>
        </div>
      </div>

      <div className="notes-section">
        <div className="notes-header">
          <PageRange
            setReadingSessions={setReadingSessionIdx}
            readingSessionIdx={readingSessionIdx}
            setPageRange={setPageRange}
            pageRange={pageRange}
          />

          <ActionButton
            options={[
              {
                label: "Remove from Library",
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
                    console.error("There was an error deleting the book!", err);
                  }
                },
              },
              {
                label: "Next Reading Session",
                action: async () => {
                  // * Do API call to create new reading session
                  // * grab next reading session in state or Go to next one
                  const notes = document.querySelector("textarea").value;
                  if (notes.trim() === "") {
                    alert("Notes cannot be empty");
                    return;
                  }

                  if (readingSessionIdx === readingSessions.length - 1) {
                    alert(
                      "You can only create a new reading session from the latest session."
                    );
                    return;
                  }

                  try {
                    // Save current reading session
                    await axiosInstance.post(
                      `/reading-sessions/save-reading-session/${user.uuid}/${id}`,
                      {
                        notes: notes,
                        pageRange,
                        sessionUuid: curSession.uuid,
                      }
                    );

                    // Create new reading session
                    const nextStartPage = pageRange[1] + 1 || 1;
                    const nextEndPage =
                      nextStartPage + pagesPerDay - 1 || pagesPerDay;
                    setPageRange([nextStartPage, nextEndPage]);

                    const { data: newReadingSession } =
                      await axiosInstance.post(
                        `/reading-sessions/create-reading-session/${user.uuid}/${id}`,
                        {
                          pageRange: [nextStartPage, nextEndPage],
                        }
                      );

                    const updatedSessions = [...readingSessions];
                    updatedSessions[readingSessionIdx] = {
                      ...updatedSessions[readingSessionIdx],
                      pageRange,
                    };
                    setReadingSessions([newReadingSession, ...updatedSessions]);

                    document.querySelector("textarea").value = "";
                    setSnackbarMessage(
                      "Reading session saved and new session created!"
                    );
                    setSnackbarOpen(true);
                  } catch (err) {
                    console.error(
                      "There was an error saving the reading session!",
                      err
                    );
                    alert("Failed to save reading session. Please try again.");
                  }
                },
              },
              {
                label: "Go to Book Details Pages",
                action: () => navigate(`/book?id=${book.googleId}`),
              },
              {
                label: "Correct grammar and punctuation",
                action() {
                  console.log("action");
                },
              },
            ]}
          />
        </div>
        <textarea
          ref={textArea}
          rows="10"
          cols="50"
          onChange={(e) => {
            const updatedSessions = [...readingSessions];
            updatedSessions[readingSessionIdx] = {
              ...updatedSessions[readingSessionIdx],
              notes: e.target.value,
            };
            setReadingSessions(updatedSessions);
          }}
          placeholder="Write your notes here..."
          value={readingSessions[readingSessionIdx]?.notes ?? ""}
          style={{ resize: "none" }}
        ></textarea>
      </div>
      <div className="button-container">
        <button onClick={handleSave} style={{ marginRight: "12px" }}>
          Save Notes
        </button>
      </div>
      <ReadingSessionList
        readingSessionIdx={readingSessionIdx}
        setReadingSessionIdx={setReadingSessionIdx}
        readingSessions={readingSessions}
      />
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

export default BookDetails;
