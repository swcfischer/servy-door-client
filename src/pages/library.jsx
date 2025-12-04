import React, { useState } from "react";
import { useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import styled from "@emotion/styled";
import BookItem from "../components/BookItem";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { Link } from "gatsby";
import { css } from "@emotion/react";

const Container = styled.div`
  .header-container {
    h1 {
      margin-right: 12px;
    }

    a {
      color: #000;
    }

    display: flex;
    align-items: center;
  }

  .books-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 64px;

    ${(props) =>
      props.isLoading &&
      css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
  }

  @media (max-width: 600px) {
    .books-list {
      grid-template-columns: 1fr;
    }
  }
`;

function Library() {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // First, silently clean up any orphaned books
        try {
          await axiosInstance.post(
            `/books/cleanup-orphaned-books/${user.uuid}`
          );
        } catch (cleanupError) {
          // Silently fail - don't let cleanup errors affect the main flow
          console.warn("Cleanup warning:", cleanupError);
        }

        // Then fetch the user's books
        const response = await axiosInstance.get(
          "/books/user-books/" + user.uuid
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.uuid) {
      fetchData();
    }
  }, [user]);

  return (
    <Container isLoading={isLoading}>
      <div className="header-container">
        <h1>Library</h1>
        <Link to="/bookmarks">Bookmarks</Link>
      </div>
      <div className="books-list">
        {isLoading ? (
          <LoadingSpinner />
        ) : books.length > 0 ? (
          books
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((bk) => {
              return (
                <BookItem
                  to={`/library/book-details?id=${bk.uuid}`}
                  id={bk.uuid}
                  key={bk.uuid}
                  volumeInfo={bk.volumeInfo}
                />
              );
            })
        ) : (
          <p>You have not selected a book to read yet.</p>
        )}
      </div>
    </Container>
  );
}

export default Library;
