import React, { useContext, useEffect, useState } from "react";
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

const Container = styled.div`
  .book-details {
    display: flex;

    .img-container {
      display: inline-block;
      margin-right: 24px;
      img {
      }
    }
  }
  .notes-section {
    textarea {
      border-radius: 3px;
      border: 1px solid #333;
      padding: 8px;

      width: 100%;
      font-family: inherit;
      font-size: 18px;
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
`;

export function renderGoogleAuthorLinks(authors) {
  return authors.map((author, idx) => {
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
  const [pageRange, setPageRang] = useState([]);
  const [pagesPerDay, setPagesPerDay] = useState(null);

  useEffect(() => {
    // * Fetch book details using the id
    async function fetchData() {
      const res = await axiosInstance.get(`/books/book/${user.uuid}?id=${id}`);
      // * Fetch Reading Sessions
      const resSession = await axiosInstance.get(
        `/reading-sessions/all/${user.uuid}/${id}`
      );
      setBook(res.data);
      setReadingSessions(resSession.data);
      const _pagesPerDay = Math.round(
        Number(res.data.pageCount) / (Number(res.data.weeks) * 7)
      );
      setPagesPerDay(_pagesPerDay);
      // * Set pageCount

      if (!readingSessions.length) {
        setPageRang([1, _pagesPerDay]);
      } else {
        // resSession.data[resSession.data.length - 1];
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
        <div>
          <dl>
            <dt>Author{book.volumeInfo?.authors.length > 1 ? "s" : ""}</dt>
            <dd>{renderGoogleAuthorLinks(book.volumeInfo?.authors)}</dd>

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
            <span style={{ fontSize: "0.8em", fontWeight: "normal" }}>
              {" "}
              (pages {pageRange[0]} - {pageRange[1]}){" "}
            </span>
            <span style={{ fontSize: "0.55em", fontWeight: "normal" }}>
              in{" "}
              <a
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
              >
                Markdown
              </a>
            </span>
          </h2>

          <button
            onClick={async () => {
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this book?"
              );
              if (!confirmDelete) {
                return;
              }

              try {
                await axiosInstance.delete(`/books/book/${user.uuid}?id=${id}`);
                // Redirect or update state after deletion
                navigate("/library");
              } catch (err) {
                console.error("There was an error deleting the book!", err);
              }
            }}
          >
            Remove Book
          </button>
        </div>
        {/* Say page range, programatically  */}
        <textarea
          rows="10"
          cols="50"
          placeholder="Write your notes here..."
        ></textarea>
      </div>
      <div className="button-container">
        {/* Will have to add functionality */}
        <button
          onClick={async (e) => {
            console.log(e);
          }}
          style={{ marginRight: "12px" }}
        >
          Save Above Text
        </button>
      </div>
      {/* Show previous notes, if possible */}
      <h3>Previous entries</h3>
    </Container>
  );
}

export default BookDetails;
