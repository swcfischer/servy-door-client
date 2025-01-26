import React, { useContext, useState } from "react";
import axiosInstance from "../axiosInstance";
import Modal from "react-modal";
import { navigate } from "gatsby";
import { UserContext } from "./Layout";

function ReadBookModal(props) {
  const { readModalIsOpen, setReadModalIsOpen, state } = props;

  const { user } = useContext(UserContext);

  const [weeks, setWeeks] = useState("");
  const [motivation, setMotivation] = useState("");

  const handleMotivationChange = (event) => {
    setMotivation(event.target.value);
  };

  const handleWeeksChange = (event) => {
    setWeeks(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log(`Weeks: ${weeks}`);
  };

  return (
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
          background: "rgba(0,0,0,.9)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <button
        className="read-modal-close-button"
        onClick={() => {
          setReadModalIsOpen(false);
        }}
      >
        Close
      </button>
      <div>
        <h2 style={{ fontWeight: "normal", fontStyle: "italic" }}>
          How many weeks do you want to spend reading {state.volumeInfo.title}?
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={weeks}
            onChange={handleWeeksChange}
            min="0"
            placeholder="Weeks"
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              boxSizing: "border-box",
              border: "1px solid black",
              borderRadius: "4px",
            }}
          />

          {weeks && (
            <p>
              You need to read approximately{" "}
              <strong>
                {Math.ceil(state.volumeInfo.pageCount / (weeks * 7))} pages per
                day.
              </strong>
            </p>
          )}

          {weeks && (
            <>
              <h2 style={{ fontWeight: "normal", fontStyle: "italic" }}>
                Motivation for reading {state.volumeInfo.title}
              </h2>
              <input
                type="text"
                value={motivation}
                onChange={handleMotivationChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "10px 0",
                  boxSizing: "border-box",
                  border: "1px solid black",
                  borderRadius: "4px",
                }}
              />
            </>
          )}

          {weeks && (
            <button
              type="submit"
              style={{
                backgroundColor: "#333",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "16px",
              }}
              onClick={async (e) => {
                try {
                  const { data } = await axiosInstance.post(
                    "/books/create-book/" + user.uuid,
                    {
                      title: state.volumeInfo.title,
                      image: state.img.image,
                      weeks: weeks,
                      volumeInfo: state.volumeInfo,
                      pageCount: state.volumeInfo.pageCount,
                      infoLink: state.volumeInfo.infoLink,
                      previewLink: state.volumeInfo.previewLink,
                      publisher: state.volumeInfo.publisher,
                      datePublished: state.volumeInfo.publishedDate,
                      author: state.volumeInfo.authors.join(", "),
                      motivation: motivation, // Add the motivation value if available
                      summary: state.volumeInfo.description,
                    }
                  );
                  navigate("/library/book-details?id=" + data.uuid);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}

export default ReadBookModal;
