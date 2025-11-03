import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "react-modal";
import capitalizeFirstLetter, {
  removeHtmlTags,
} from "../../utils/capitalizeFirstLetter";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../axiosInstance";

Modal.setAppElement("body");

const customStyle = {
  content: {
    position: "fixed",
    top: 100,
    height: "min-content",
    boxSizing: "border-box",
    margin: "auto",
    background: "#222",
    color: "#d4c066",
    maxWidth: "500px",
    maxHeight: "100vh",
    overflowY: "auto",
    paddingBottom: "42px",
    border: "1px solid #5e5e5e",
    borderRadius: "3px",
  },
  overlay: {
    background: "rgba(0,0,0,.9)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Container = styled.div`
  text-decoration: none;
  min-width: 100px;
  height: max-content;
  box-sizing: border-box;
  padding-bottom: 60px;

  h3 {
    margin-bottom: 18px;
  }

  p {
    color: #d4c066;
  }

  .word-container {
    ol {
      padding-left: 42px;
      margin-top: 2px;
    }

    .word-item {
      cursor: pointer;

      .word-item__btn {
        color: rgba(0, 0, 0, 0.7);
        background: transparent;
        padding: 0;
        text-align: left;
        font-family: inherit;
        border: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &.selected {
      .word-item__btn {
        text-decoration: underline;
      }
    }
  }
`;

const InnerModalContainer = styled.div`
  position: relative;
  margin-top: 12px;
  padding-top: 12px;

  h2 {
    text-align: center;
    color: #d4c066;
  }

  p {
    font-size: 18px;
  }

  button {
    height: max-content;
    padding: 11px 20px;
    font-size: 16px;
    border-radius: 3px;
    border: 1px solid #5e5e5e;
    background-color: #222;
    color: #d4c066;
    cursor: pointer;
    margin-top: 12px;
    transition: all 0.3s ease;
    font-family: inherit;

    &:hover {
      background-color: #333;
      border-color: #7e7e7e;
    }

    &:focus {
      outline: 2px solid #d4c066;
      outline-offset: 2px;
    }
  }

  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }

  .delete-btn {
    margin-top: 35px;
    background-color: #5c1e1e;
    border-color: #8b2c2c;
    color: #ff9999;

    &:hover {
      background-color: #7a2525;
      border-color: #b33a3a;
    }

    &:focus {
      outline: 2px solid #ff9999;
      outline-offset: 2px;
    }
  }
`;

function WordReadingSession(props) {
  const { definitions, userUuid, setDefinitions } = props;

  const [selectedDef, setSelectedDef] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (def) => (e) => {
    e.preventDefault();
    setSelectedDef(def);
    setIsOpen(true);
  };

  return (
    <Container>
      <h3 style={{ marginBottom: "8px" }}>Look-up</h3>
      <div className="word-container">
        <div>
          {definitions.length > 0 ? (
            <ol reversed>
              {definitions.map((def, idx) => {
                return (
                  <li key={`${def.word}-${idx}`} className="word-item">
                    <button
                      onClick={handleClick(def)}
                      className="word-item__btn"
                    >
                      {capitalizeFirstLetter(def.word)}
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p>Look up a word or phrase using the actions menu above</p>
          )}

          <Modal
            isOpen={isOpen}
            onRequestClose={() => {
              setIsOpen(false);
            }}
            contentLabel="Word Lookup Modal"
            style={customStyle}
          >
            <InnerModalContainer>
              <h2>{capitalizeFirstLetter(selectedDef?.word)}</h2>
              <ReactMarkdown>
                {removeHtmlTags(
                  selectedDef?.definition + selectedDef?.definition
                )}
              </ReactMarkdown>

              <button
                className="close-btn"
                onClick={() => {
                  setSelectedDef(null);
                  setIsOpen(false);
                }}
              >
                Close
              </button>
              <button
                className="delete-btn"
                onClick={async () => {
                  // * Do API call to delete the word
                  const { data } = await axiosInstance.delete(
                    `/book-word-definition/definition/${userUuid}/${selectedDef.uuid}`
                  );
                  console.log(data);
                  // * Update the state to remove the word from the list
                  if (typeof props.onDelete === "function") {
                    props.onDelete(selectedDef.id);
                  }
                  // * Close the modal
                  setDefinitions((prev) =>
                    prev.filter((d) => d.uuid !== selectedDef.uuid)
                  );

                  setSelectedDef(null);
                  setIsOpen(false);
                }}
              >
                Delete
              </button>
            </InnerModalContainer>
          </Modal>
        </div>
      </div>
    </Container>
  );
}

export default WordReadingSession;
