import React from "react";
import styled from "@emotion/styled";
import formatDate from "../../utils/formatDate";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { WRITING_COMMENT } from "../../pages/book";
import WritingComment from "./WritingComment";

const Container = styled.div`
  h3 {
    position: relative;
    font-size: 16px;
    font-weight: bold;
    max-width: 150px;
    margin: 0 auto;
    line-height: 24px;
    color: #080808;
    padding-bottom: 24px;

    .lightbulb-icon {
      position: absolute;
      top: 0px;
      left: -48px;
      font-size: 32px;
      color: #765503;
    }
  }

  .comment {
    max-width: 300px;
    margin: 0 auto 30px auto;
    border-bottom: 2px solid #333;
    border-bottom: 1px solid #765503;

    .comment__header {
      color: #765503;
    }
    hr {
      width: 50px;
      margin-left: 0;
      height: 1px;
      border: none;
      background: #765503;
    }
  }
`;

const comments = Array.from({ length: 15 }, (_, index) => ({
  text: `Comment ${
    index + 1
  } Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem earum, unde maiores nam dolor quos aliquam, laboriosam molestias quam illo debitis libero reiciendis, tenetur quia? Laboriosam expedita consectetur quo ipsum.`,
  author: `Author ${index + 1}`,
  date: new Date().toISOString(),
}));

function BookComments(props) {
  const { commentState } = props;
  if (WRITING_COMMENT === commentState) {
    return <WritingComment />;
  }
  return (
    <Container>
      {/* Tip about thread, which will come later */}
      {/* <h3>
        Click each comment to access the thread. <br />
        <br /> What you are reading below is a summary.
        <MdOutlineTipsAndUpdates className="lightbulb-icon" />
      </h3> */}
      <div style={{ width: 300 }}> </div>
      {comments.map((el) => (
        <Comment {...el} />
      ))}
    </Container>
  );
}

function Comment(props) {
  const { author, date, text, summary } = props;
  return (
    <div className="comment">
      <p className="comment__header">
        Summary of {author} at {formatDate(date)}
      </p>
      <hr />
      <p>{text}</p>
    </div>
  );
}

export default BookComments;
