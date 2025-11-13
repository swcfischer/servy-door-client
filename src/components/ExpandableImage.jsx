import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Modal from "react-modal";

const Container = styled.div`
  .image-button {
    background: transparent;
    border: none;
    margin-right: 40px;
    padding: 0;
    border-radius: 3px;

    &:hover {
      opacity: 0.7;
    }
  }

  img {
    border-radius: 3px;
    border: solid 1px #393939;
  }

  .image {
    cursor: zoom-in;
    border-radius: 3px;
    display: block;
  }
`;

const modalStyles = {
  content: {
    position: "relative",
    width: "90vw",
    maxWidth: "800px",
    boxSizing: "border-box",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "90vh",
    background: "#000",
    inset: "auto",
    padding: "20px",
    overflow: "auto",
    border: "1px solid #222",
  },
  overlay: {
    background: "rgba(0,0,0,.9)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

function ExpandableImage(props) {
  // * book state
  const { state } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const { width, height } = getImageDimensions(state);

  const isExpandable = state.img.width > 200; // Define a threshold for small images

  useEffect(() => {
    const isModal = new URLSearchParams(window.location.search).has("isModal");
    setModalIsOpen(isModal);
  }, []);

  return (
    <Container>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={modalStyles}
      >
        <button className="modal-close-button" onClick={closeModal}>
          Close
        </button>
        <img
          src={state.img.image}
          alt=""
          style={{
            width,
            height,
            marginTop: "12px",
          }}
        />
      </Modal>

      {isExpandable ? (
        <button
          className="image-button"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              openModal();
            }
          }}
          onClick={openModal}
          tabIndex={0}
          aria-label="Expand image"
        >
          <img
            width="200px"
            height={`${(state.img.height / state.img.width) * 200}px`}
            className="image"
            src={state.img.image}
            alt=""
          />
        </button>
      ) : (
        <img
          width="200px"
          height={`${(state.img.height / state.img.width) * 200}px`}
          style={{ marginRight: "40px", cursor: "auto" }}
          className="image"
          src={state.img.image}
          alt=""
        />
      )}
    </Container>
  );
}

export default ExpandableImage;

function getImageDimensions(state) {
  const maxWidth = Math.min(window.innerWidth * 0.8, 600);
  const maxHeight = window.innerHeight * 0.7;
  const ratio = state.img.width / state.img.height;

  let width = state.img.width;
  let height = state.img.height;

  // Scale down if image is larger than max dimensions
  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return { width, height };
}
