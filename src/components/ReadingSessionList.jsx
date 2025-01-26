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

    .reading-session__notes {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #000;
    }
  }
`;

function ReadingSessionList(props) {
  // * add state management for reading session index
  const { readingSessions, setReadingSessionIdx } = props;

  const handleClick = (_idx) => (e) => {
    e.preventDefault();
    setReadingSessionIdx(_idx);
  };

  return readingSessions.map((readingSession, idx) => {
    const pageStart = readingSession.pageRange[0];
    const pageEnd = readingSession.pageRange[1];

    return (
      <Container onClick={handleClick(idx)} className="reading-session">
        <p className="reading-session__details">
          {pageStart} to {pageEnd}
          <br /> {formatDate(readingSession.date)}
        </p>
        <p className="reading-session__notes">{readingSession.notes}</p>
        ---
      </Container>
    );
  });
}

export default ReadingSessionList;
