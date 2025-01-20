import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styled from "@emotion/styled";

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
`;

function BookDetails(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");
  const { user } = useContext(UserContext);
  const [state, setState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch book details using the id
    if (user.uuid && id) {
      axiosInstance
        .get(`/books/book/${user.uuid}?id=${id}`)
        .then((response) => {
          setState(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the book details!", error);
          setIsLoading(false);
        });
    }
  }, [user, id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <h1>{state.volumeInfo?.title}</h1>

      <div className="book-details">
        {state.volumeInfo?.imageLinks?.thumbnail && (
          <div className="img-container">
            <img
              src={state.volumeInfo.imageLinks.thumbnail}
              alt={state.volumeInfo.title}
            />
          </div>
        )}
        <div>
          <dl>
            <dt>Authors</dt>
            <dd>{state.volumeInfo?.authors?.join(", ")}</dd>

            <dt>Publisher</dt>
            <dd>{state.volumeInfo?.publisher}</dd>

            <dt>Published Date</dt>
            <dd>{state.volumeInfo?.publishedDate}</dd>
          </dl>

          <details>
            <summary>Description</summary>
            <p
              dangerouslySetInnerHTML={{
                __html: state.volumeInfo?.description,
              }}
            ></p>
          </details>
        </div>
      </div>

      <div className="notes-section">
        <h2>Notes</h2>
        <textarea
          rows="10"
          cols="50"
          placeholder="Write your notes here..."
        ></textarea>
      </div>
    </Container>
  );
}

export default BookDetails;
