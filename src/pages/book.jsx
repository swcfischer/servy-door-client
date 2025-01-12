import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { navigate } from "gatsby";
import Modal from "react-modal";

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({});
  const id = params.get("id");

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    async function fetchBook() {
      setIsLoading(true);
      const response = await axios.get(bookGet + id);
      setState(response.data);
      setIsLoading(false);
    }
    if (id) {
      fetchBook();
    }
  }, [id]);

  if (isLoading) {
    return <div>is loading</div>;
  }

  const getImageLink = () => {
    if (state.volumeInfo.imageLinks) {
      return (
        state.volumeInfo.imageLinks.extraLarge ||
        state.volumeInfo.imageLinks.large ||
        state.volumeInfo.imageLinks.medium ||
        state.volumeInfo.imageLinks.small ||
        state.volumeInfo.imageLinks.thumbnail
      );
    }
    return "";
  };

  return (
    <Layout>
      <button
        style={{
          height: "max-content",
          padding: "11px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#777",
          color: "#fff",
          cursor: "pointer",
          marginTop: "12px",
          transition: "background-color 0.3s ease",
        }}
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#555";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#777";
        }}
      >
        Go Back
      </button>
      <h1
        style={{
          fontStyle: "italic",
          fontWeight: "100",
        }}
      >
        {state.volumeInfo.title}
      </h1>
      <div style={{ display: "flex" }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          style={{
            content: {
              maxWidth: "600px",
              margin: "auto",
            },
            overlay: {
              backdropFilter: "blur(1px)",
            },
          }}
        >
          <button
            style={{
              height: "max-content",
              padding: "11px 20px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#777",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "12px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#555";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#777";
            }}
            onClick={closeModal}
          >
            Close
          </button>
          <img
            src={getImageLink()}
            alt=""
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Modal>

        <img
          width="200px"
          height="300px"
          style={{ marginRight: "40px", cursor: "zoom-in" }}
          src={getImageLink()}
          alt=""
          onClick={openModal}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
          }}
        />
        <p
          dangerouslySetInnerHTML={{ __html: state.volumeInfo.description }}
          style={{ maxWidth: "450px" }}
        ></p>
      </div>
      <dl>
        <dt>Author{state.volumeInfo.authors.length > 1 && "s"} </dt>
        <dd>{state.volumeInfo.authors.join(", ")}</dd>
        <dt>Date Published</dt>
        <dd>{state.volumeInfo.publishedDate}</dd>
        <dt>Page Count</dt>
        <dd>{state.volumeInfo.pageCount}</dd>
        <dt>Info Link</dt>
        <dd>
          <a href={state.volumeInfo.infoLink} target="_blank">
            Here
          </a>
        </dd>
        <dt>Preview Link</dt>
        <dd>
          <a href={state.volumeInfo.previewLink} target="_blank">
            Here
          </a>
        </dd>
      </dl>
    </Layout>
  );
}

export default Book;
