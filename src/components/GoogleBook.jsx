import React from "react";

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

    &:hover {
      background-color: #555;
    }
  }
`;

function GoogleBook(props) {
  const { title, author, label = "G-News" } = props;

  if (!title && !author) {
    return null;
  }

  const searchUrl = generateSearchUrl({ title, author });

  return (
    <Container>
      <a href={searchUrl} target="_blank" rel="noopener noreferrer">
        <button>{label}</button>
      </a>
    </Container>
  );
}

export function generateSearchUrl({ title, author }) {
  const query = `${title} ${author}`;
  return `https://news.google.com/search?q=${encodeURIComponent(query)}`;
}

export default GoogleBook;
