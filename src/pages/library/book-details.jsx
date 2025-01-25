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
import ActionButton from "../../components/ActionButton";

const Container = styled.div`
  .book-details {
    display: flex;

    .img-container {
      display: inline-block;
      margin-right: 24px;
      img {
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

function BookDetails(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const { user } = useContext(UserContext);

  const [book, setBook] = useState({});
  const [readingSessions, setReadingSessions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageRange, setPageRange] = useState([]);
  const [pagesPerDay, setPagesPerDay] = useState(null);
  const textArea = useRef();

  useEffect(() => {
    async function fetchData() {
      const res = await axiosInstance.get(`/books/book/${user.uuid}?id=${id}`);
      const resSession = await axiosInstance.get(
        `/reading-sessions/all/${user.uuid}/${id}`
      );
      setBook(res.data);
      setReadingSessions(resSession.data);
      const _pagesPerDay = Math.round(
        Number(res.data.pageCount) / (Number(res.data.weeks) * 7)
      );
      setPagesPerDay(_pagesPerDay);

      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      const todaySession = resSession.data.find((session) => {
        return new Date(session.date).toISOString().split("T")[0] === today;
      });

      if (!resSession.data.length) {
        setPageRange([1, _pagesPerDay]);
      } else if (todaySession) {
        setPageRange(todaySession.pageRange);
      } else {
        const lastSession = resSession.data[resSession.data.length - 1];
        const lastPageRange = lastSession ? lastSession.pageRange : [0, 0];
        const nextStartPage = lastPageRange[1] + 1;
        const nextEndPage = nextStartPage + _pagesPerDay - 1;
        setPageRange([nextStartPage, nextEndPage]);
      }
      setIsLoading(false);
    }
    if (user.uuid && id) {
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const todaySession = readingSessions.find((session) => {
    return new Date(session.date).toISOString().split("T")[0] === today;
  });
  const previousSessions = readingSessions.filter((session) => {
    return new Date(session.date).toISOString().split("T")[0] !== today;
  });

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
            <dt>Time to Read</dt>
            <dd>{book.weeks} weeks</dd>
            <dt>Pages per Day</dt>
            <dd>{pagesPerDay} </dd>
            <dt>Motivation</dt>
            <dd>{book.motivation}</dd>
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
          <h2>
            Notes
            <span style={{ fontSize: "0.6em", fontWeight: "normal" }}>
              {" "}
              (pages {pageRange[0]} - {pageRange[1]})
            </span>
          </h2>
        </div>
        <textarea
          ref={textArea}
          rows="10"
          cols="50"
          placeholder="Write your notes here..."
          defaultValue={todaySession?.notes ?? ""}
          style={{ resize: "none" }}
        ></textarea>
      </div>
      <div className="button-container">
        {/* Will have to add functionality */}
        <button
          onClick={async (e) => {
            const notes = document.querySelector("textarea").value;
            if (notes.trim() === "") {
              alert("Notes cannot be empty");
              return;
            }

            try {
              await axiosInstance.post(
                `/reading-sessions/create-or-update-reading-session/${user.uuid}/${id}`,
                {
                  notes: notes,
                  pageRange,
                }
              );
              alert("Notes saved successfully!");
            } catch (err) {
              console.error("There was an error saving the notes!", err);
              alert("Failed to save notes. Please try again.");
            }
          }}
          style={{ marginRight: "12px" }}
        >
          Save Notes
        </button>

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
              action: async () => {},
            },
          ]}
        />
      </div>
      {/* Show previous notes, if possible */}
      <h3>Reading Sessions</h3>
      {previousSessions.map((readingSession) => {
        return <div key={readingSession.uuid}>{readingSession.notes}</div>;
      })}
    </Container>
  );
}

export default BookDetails;
