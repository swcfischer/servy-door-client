import React, { useContext, useState } from "react";
import Modal from "react-modal";
import styled from "@emotion/styled";
import { UserContext } from "../Layout";
import { navigate } from "gatsby";
import { buildQueryParams } from "../../utils/queryFunctions";

Modal.setAppElement("body");

const customStyle = {
  content: {
    position: "fixed",
    top: 100,
    height: "min-content",
    boxSizing: "border-box",
    margin: "100px auto auto auto",
    background: "#fafafa",
    maxWidth: "500px",
    maxHeight: "100vh",
    overflowY: "auto",
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
  }

  ul {
    width: 200px;
    margin: 0 auto;
    /* list-style: none; */
    li.list-item {
      margin-bottom: 12px;
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

  .close-btn {
    position: absolute;
    top: -34px;
    right: -6px;
  }
`;

function AuthorModal({ isOpen, onRequestClose, authorStr }) {
  const { user } = useContext(UserContext);
  const state = {};

  const handleRequestClose = () => {
    onRequestClose();
  };

  const handleClick = (innerAuthStr) => {
    navigate(
      `/?${buildQueryParams({
        q: innerAuthStr,
        page: 1,
        searchFilter: "author",
      })}`
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      contentLabel="Word Lookup Modal"
      style={customStyle}
    >
      <Container>
        <>
          <h2>Choose Author Search</h2>
          <ul>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(authorStr.join(", "));
                }}
                href="#"
              >
                {" "}
                {authorStr.map((el, idx) => (
                  <div>
                    {el}
                    {idx === authorStr.length - 1 ? "" : ","}
                  </div>
                ))}
              </a>
            </li>
            <h3>Or</h3>
            {authorStr.map((el) => {
              return (
                <li key={el} className="list-item">
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(el);
                    }}
                    href="#"
                  >
                    {el}
                  </a>
                </li>
              );
            })}
          </ul>
          <button className="close-btn" onClick={handleRequestClose}>
            Close
          </button>
        </>
      </Container>
    </Modal>
  );
}

export default AuthorModal;
