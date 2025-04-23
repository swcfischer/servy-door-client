import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../Layout";

Modal.setAppElement("body");

const customStyle = {
  content: {
    position: "fixed",
    top: 100,
    width: "800px",
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
  position: relative;

  h2 {
    text-align: center;
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
      }

      .form-field {
        padding-bottom: 12px;
        font-family: inherit;
        padding: 6px;
        font-size: 16px;
      }
    }
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

  .submit-btn {
    width: 100%;
  }
  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setCurState(FORM);
        setDefinition("");
        onRequestClose();
      }}
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
                    <label htmlFor="wordOrPhrase">Word or Phrase*</label>
                    <Field
                      className="form-field"
                      name="wordOrPhrase"
                      type="text"
                    />
                    <ErrorMessage
                      component="div"
                      name="wordOrPhrase"
                      style={{
                        color: "red",
                        position: "absolute",
                        bottom: 10,
                        left: 0,
                      }}
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
                    />
                    <ErrorMessage
                      name="surroundingSentence"
                      component="div"
                      style={{
                        color: "red",
                        position: "absolute",
                        bottom: 10,
                        left: 0,
                      }}
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
            <button className="close-btn" onClick={onRequestClose}>
              Close
            </button>
          </>
        ) : (
          <div>
            <h2>Definition</h2>
            <p dangerouslySetInnerHTML={{ __html: definition?.definition }}></p>

            <button className="close-btn" onClick={onRequestClose}>
              Close
            </button>
          </div>
        )}
      </Container>
    </Modal>
  );
}

export default WordLookUpModal;
