import React, { useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "gatsby";
import Modal from "react-modal";

import { TextField, Button } from "@mui/material";

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({});
  const id = params.get("id");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [readModalIsOpen, setReadModalIsOpen] = useState(false);

  const [weeks, setWeeks] = useState("");

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleWeeksChange = (event) => {
    setWeeks(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log(`Weeks: ${weeks}`);
  };

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
    <div>
      <button
        style={{
          height: "max-content",
          padding: "11px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#333",
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
          e.target.style.backgroundColor = "#333";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#111";
        }}
      >
        Go Back
      </button>
      <button
        style={{
          height: "max-content",
          padding: "11px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#222",
          color: "#fff",
          cursor: "pointer",
          marginTop: "12px",
          marginLeft: "12px",
          transition: "background-color 0.3s ease",
        }}
        onClick={(e) => {
          e.preventDefault();
          setReadModalIsOpen(true);
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#222";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#000";
        }}
      >
        Read
      </button>
      <button
        style={{
          height: "max-content",
          padding: "11px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#222",
          color: "#fff",
          cursor: "pointer",
          marginTop: "12px",
          marginLeft: "12px",
          transition: "background-color 0.3s ease",
        }}
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#222";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#000";
        }}
      >
        Save
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
              display: "flex",
              flexDirection: "column",
            },
            overlay: {},
          }}
        >
          <img
            src={getImageLink()}
            alt=""
            style={{
              height: "80vh",
              width: "auto",
            }}
          />
          <button
            style={{
              height: "max-content",
              padding: "11px 20px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#333",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "12px",
              transition: "background-color 0.3s ease",
              marginTop: "24px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#111";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#333";
            }}
            onClick={closeModal}
          >
            Close
          </button>
        </Modal>

        <div>
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
          <dl>
            <dt>Author{state.volumeInfo.authors.length > 1 && "s"} </dt>
            <dd>{state.volumeInfo.authors.join(", ")}</dd>
            <dt>Publisher</dt>
            <dd>{state.volumeInfo.publisher}</dd>
            <dt>Date Published</dt>
            <dd>
              {new Date(state.volumeInfo.publishedDate).toLocaleDateString()}
            </dd>
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
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: state.volumeInfo.description }}
          style={{ maxWidth: "450px", float: "left" }}
        ></p>
      </div>
      <Modal
        isOpen={readModalIsOpen}
        onRequestClose={() => {
          setReadModalIsOpen(false);
        }}
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
          onClick={() => {
            setReadModalIsOpen(false);
          }}
        >
          Close
        </button>
        <div>
          <h2 style={{ fontWeight: "normal", fontStyle: "italic" }}>
            How long do want to spend reading {state.volumeInfo.title}?
          </h2>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Weeks"
              type="number"
              value={weeks}
              onChange={handleWeeksChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 0,
              }}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black",
                },
              }}
            />

            {weeks && (
              <p>
                You need to read approximately{" "}
                <strong>
                  {Math.ceil(state.volumeInfo.pageCount / (weeks * 7))} pages
                  per day.
                </strong>
              </p>
            )}
            {weeks && (
              <TextField
                label={"Motivation for reading " + state.volumeInfo.title}
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                    "&:hover fieldset": {
                      borderColor: "black",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "black",
                  },
                }}
              />
            )}

            {weeks && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
              >
                Submit
              </Button>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Book;
