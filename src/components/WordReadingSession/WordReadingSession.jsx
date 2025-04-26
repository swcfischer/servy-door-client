import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal from "react-modal";
import capitalizeFirstLetter, {
  removeHtmlTags,
} from "../../utils/capitalizeFirstLetter";
import ReactMarkdown from "react-markdown";

Modal.setAppElement("body");

const customStyle = {
  content: {
    position: "fixed",
    top: 100,
    height: "min-content",
    boxSizing: "border-box",
    margin: "auto",
    background: "#fafafa",
    maxWidth: "500px",
    inset: "-160px 40px 40px",
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
  max-height: 500px;

  h3 {
    margin-bottom: 18px;
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

  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }
`;

function WordReadingSession(props) {
  const { definitions } = props;

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
                {removeHtmlTags(selectedDef?.definition)}
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
            </InnerModalContainer>
          </Modal>
        </div>
      </div>
    </Container>
  );
}

export default WordReadingSession;
