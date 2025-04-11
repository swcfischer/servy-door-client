import React from "react";
// import formatDate from "../utils/formatDate";
import styled from "@emotion/styled";

const Container = styled.a`
  text-decoration: none;

  &.reading-session {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
    .reading-session__details {
      color: rgba(0, 0, 0, 0.7);
    }
  }

  &.selected {
    .reading-session__details {
      text-decoration: underline;
      text-transform: uppercase;
    }
  }
`;

function WordReadingSession(props) {
  // * Add state management for reading session index

  return (
    <div>
      <h3>Dictionary Words</h3>

      <Container className="reading-session selected">
        <p className="reading-session__details">hello</p>
      </Container>
    </div>
  );
}

export default WordReadingSession;
