import React from "react";
import formatDate from "../utils/formatDate";
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
      font-weight: bold;
    }
  }
`;

function ReadingSessionList(props) {
  // * add state management for reading session index
  const { readingSessions, setReadingSessionIdx, readingSessionIdx } = props;

  const handleClick = (_idx) => (e) => {
    e.preventDefault();
    setReadingSessionIdx(_idx);
  };

  return readingSessions.map((readingSession, idx) => {
    if (!readingSession.pageRange) {
      return null;
    }
    const pageStart = readingSession.pageRange[0];
    const pageEnd = readingSession.pageRange[1];

    return (
      <Container
        onClick={handleClick(idx)}
        className={`reading-session ${
          readingSessionIdx === idx ? "selected" : ""
        }`}
      >
        <p className="reading-session__details">
          {pageStart} to {pageEnd}, {formatDate(readingSession.date)}
        </p>
      </Container>
    );
  });
}

export default ReadingSessionList;
