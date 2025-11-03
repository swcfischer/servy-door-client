import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../Layout";
import { removeHtmlTags } from "../../utils/capitalizeFirstLetter";
import ReactMarkdown from "react-markdown";

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
  position: relative;
  margin-top: 12px;
  padding-top: 12px;

  h2 {
    text-align: center;
    color: #d4c066;
  }

  form {
    min-height: 225px;

    .field-container {
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 32px;

      label {
        padding-bottom: 8px;
        font-weight: bold;
        color: #d4c066;

        .is-required {
          color: #ff6b6b;
        }
      }

      .form-field {
        padding-bottom: 12px;
        font-family: inherit;
        padding: 6px;
        font-size: 16px;
        background-color: #333;
        color: #d4c066;
        border: 1px solid #5e5e5e;
        border-radius: 3px;
        transition: all 0.3s ease;

        &:hover {
          border-color: #7e7e7e;
        }

        &:focus {
          outline: 2px solid #d4c066;
          outline-offset: 2px;
          border-color: #d4c066;
        }

        &::placeholder {
          color: rgba(212, 192, 102, 0.6);
        }
      }
    }
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .submit-btn {
    width: 100%;
  }

  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }

  .error-message {
    color: #ff6b6b;
    position: absolute;
    bottom: 10px;
    left: 0;
  }
`;

export const FORM = "FORM";
export const RESULTING_DEFINTION = "RESULTING_DEFINTION";

function WordLookUpModal({
  isOpen,
  onRequestClose,
  setDefinitions,
  bookUuid,
  googleId,
  formState = FORM,
}) {
  const [curState, setCurState] = useState(formState);
  const [definition, setDefinition] = useState("");
  const { user } = useContext(UserContext);

  const validationSchema = Yup.object({
    wordOrPhrase: Yup.string().required("Word or phrase is required"),
    surroundingSentence: Yup.string(),
  });

  const handleRequestClose = () => {
    setCurState(FORM);
    setDefinition("");
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      contentLabel="Word Lookup Modal"
      style={customStyle}
    >
      <Container>
        {curState === FORM ? (
          <>
            <h2>Word Lookup</h2>

            <Formik
              initialValues={{ wordOrPhrase: "", surroundingSentence: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const { data } = await axiosInstance.post(
                  "/book-word-definition/create-definition/" + user?.uuid,
                  {
                    bookUuid,
                    googleId,
                    word: values.wordOrPhrase,
                    context: values.surroundingSentence,
                  }
                );
                setDefinition(data);
                setDefinitions((prev) => {
                  return [data, ...prev];
                });
                setCurState(RESULTING_DEFINTION);

                // resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="field-container">
                    <label htmlFor="wordOrPhrase">
                      Word or Phrase<span className="is-required"> *</span>
                    </label>
                    <Field
                      className="form-field"
                      name="wordOrPhrase"
                      type="text"
                      autoFocus
                      autoComplete="off"
                    />
                    <ErrorMessage
                      component="div"
                      name="wordOrPhrase"
                      className="error-message"
                    />
                  </div>
                  <div className="field-container">
                    <label htmlFor="surroundingSentence">
                      Surrounding Sentence
                    </label>
                    <Field
                      className="form-field"
                      name="surroundingSentence"
                      as="textarea"
                      autoComplete="off"
                    />
                    <ErrorMessage
                      name="surroundingSentence"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <button
                    className="submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            <button className="close-btn" onClick={handleRequestClose}>
              Close
            </button>
          </>
        ) : (
          <div>
            <h2 style={{ color: "#d4c066" }}>Definition</h2>
            <div style={{ color: "#d4c066", lineHeight: "1.6" }}>
              <ReactMarkdown>
                {removeHtmlTags(definition?.definition)}
              </ReactMarkdown>
            </div>

            <button className="close-btn" onClick={handleRequestClose}>
              Close
            </button>
          </div>
        )}
      </Container>
    </Modal>
  );
}

export default WordLookUpModal;
