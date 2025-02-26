import React, { useState } from "react";
import { useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import styled from "@emotion/styled";
import BookItem from "../components/BookItem";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const Container = styled.div`
  .books-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 64px;
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
    <Container>
      <h1>Library</h1>
      <div className="books-list">
        {isLoading ? (
          <LoadingSpinner />
        ) : books.length > 0 ? (
          books.map((bk) => {
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

/* <ul>
  <li>Reading</li>
  <li>Bookmarked</li>
</ul> */
export default Library;
