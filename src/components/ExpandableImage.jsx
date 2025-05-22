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
    width: "800px",
    boxSizing: "border-box",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    maxHeight: "100vh",
    background: "#000",
    inset: 0,
    padding: 0,
    overflow: "auto",
    maxWidth: "100%",
    border: "1px solid #222"
  },
  overlay: {
    background: "rgba(0,0,0,.9)",
    backdropFilter: "blur(8px)",
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

      {isExpandable && (
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
      )}
      {!isExpandable && (
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
