import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

function WritingComment(props) {
  const [comment, setComment] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    if (comment.trim() === "") {
      setError("Comment cannot be empty");
      return;
    }
    setError("");

    // Simulate an AJAX call
    console.log("Submitting comment:", comment);
    // You can replace this with an actual AJAX call using fetch or axios
  };

  return (
    <Container>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </Container>
  );
}

export default WritingComment;
