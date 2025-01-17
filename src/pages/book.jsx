import React, { useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "gatsby";
import Modal from "react-modal";

import { TextField, Button } from "@mui/material";
import { getImageLink } from "../utils/image";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import styled from "@emotion/styled";

const Container = styled.div`
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
  }

  button:hover {
    background-color: #555;
  }

  button:active {
    background-color: #111;
  }

  h1 {
    font-style: italic;
    font-weight: 100;
  }

  .modal-content {
    position: relative;
    width: 800px;
    box-sizing: border-box;
    margin: auto;
    display: flex;
    justify-content: center;
    max-height: 100vh;
    background: #000;
    inset: 0;
    padding: 0;
    overflow: auto;
    max-width: 100%;
  }

  .modal-overlay {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(8px);
  }

  .close-button {
    height: max-content;
    padding: 11px 20px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    margin-bottom: 12px;
    transition: background-color 0.3s ease;
    margin-top: 24px;
    position: absolute;
    width: 100px;
    left: 0;
    top: 0px;
  }

  .close-button:hover {
    background-color: #111;
  }

  .image-button {
    background: transparent;
    border: none;
    margin-right: 40px;
    padding: 0;
    border-radius: 3px;
  }

  .image-button:hover {
    opacity: 0.7;
  }

  .image-button img {
    cursor: zoom-in;
    border-radius: 3px;
    display: block;
  }

  dl {
    max-width: 210px;
  }

  p {
    max-width: 450px;
    float: left;
  }

  .read-modal-content {
    max-width: 600px;
    margin: auto;
  }

  .read-modal-overlay {
    backdrop-filter: blur(1px);
  }

  .read-modal-close-button {
    height: max-content;
    padding: 11px 20px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    background-color: #777;
    color: #fff;
    cursor: pointer;
    margin-bottom: 12px;
    transition: background-color 0.3s ease;
  }

  .read-modal-close-button:hover {
    background-color: #555;
  }
`;

const bookGet = "https://www.googleapis.com/books/v1/volumes/";

function Book(props) {
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");
  const isModal = Boolean(params.get("isModal"));

  const [isLoading, setIsLoading] = useState(true);

  const [state, setState] = useState({});

  const [modalIsOpen, setModalIsOpen] = useState(isModal);

  const [readModalIsOpen, setReadModalIsOpen] = useState(false);
  const [weeks, setWeeks] = useState("");

  const openModal = () => {
    setModalIsOpen(true);
  };
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
      const img = await getImageLink(response.data.volumeInfo.imageLinks);

      setState({
        ...response.data,
        img,
      });

      setIsLoading(false);
    }
    Modal.setAppElement("body");
    if (id) {
      fetchBook();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Container className="fade-in">
      <button
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Go Back
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          setReadModalIsOpen(true);
        }}
      >
        Read
      </button>
      <h1>{state.volumeInfo.title}</h1>
      <div style={{ display: "flex" }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
        >
          <button onClick={closeModal}>Close</button>
          <img
            src={state.img.image}
            alt=""
            style={{
              ...getImageDimensions(state),
              marginTop: "12px",
            }}
          />
        </Modal>

        <div>
          <button
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                openModal();
              }
            }}
            onClick={openModal}
            tabIndex={0}
          >
            <img
              width="200px"
              height={`${(state.img.height / state.img.width) * 200}px`}
              src={state.img.image}
              alt=""
            />
          </button>
          <dl style={{ maxWidth: "210px" }}>
            <dt>Author{state.volumeInfo.authors?.length > 1 && "s"} </dt>
            <dd>
              {state.volumeInfo?.authors?.map((auth, idx) => {
                return (
                  <div key={idx}>
                    {auth}
                    <br />
                  </div>
                );
              })}
            </dd>
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
              <a
                href={state.volumeInfo.infoLink}
                rel="noreferrer"
                target="_blank"
              >
                Here
              </a>
            </dd>
            <dt>Preview Link</dt>
            <dd>
              <a
                href={state.volumeInfo.previewLink}
                rel="noreferrer"
                target="_blank"
              >
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
      >
        <button
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
    </Container>
  );
}

export default Book;

function getImageDimensions(state) {
  const maxWidth = 600;
  const ratio = state.img.width / state.img.height;

  if (state.img.width > maxWidth) {
    return {
      width: maxWidth,
      height: maxWidth / ratio,
    };
  }

  return {
    width: state.img.width,
    height: state.img.height,
  };
}
