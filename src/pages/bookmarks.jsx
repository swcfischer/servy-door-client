import React, { useState } from "react";
import { useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import styled from "@emotion/styled";
import BookItem from "../components/BookItem";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { Link } from "gatsby";

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

  .bookmarks-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 64px;
  }

  @media (max-width: 600px) {
    .bookmarks-list {
      grid-template-columns: 1fr;
    }
  }
`;

function Bookmarks() {
  const { user } = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/bookmarks/user-bookmarks/" + user.uuid
        );
        setBookmarks(response.data);
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
      <div className="header-container">
        <h1>Bookmarks</h1>
        <Link to="/library">Library</Link>
      </div>
      <div className="bookmarks-list">
        {isLoading ? (
          <LoadingSpinner />
        ) : bookmarks.length > 0 ? (
          bookmarks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((bk) => {
              return (
                <BookItem
                  //   Go to book details
                  to={`/book?id=${bk.googleId}`}
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

export default Bookmarks;
