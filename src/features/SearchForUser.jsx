import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  padding-top: 24px;
  width: 100%;
`;

const inputStyles = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #000",
  backgroundColor: "#1c1e20",
  color: "#fff",
  boxSizing: "border-box",
  maxWidth: "75%",
  display: "block",
  boxShadow: "var(--Paper-shadow)",
};

function SearchForUser(props) {
  const q = "";

  const handleOnSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      <form
        onSubmit={handleOnSubmit}
        style={{
          display: "flex",
        }}
      >
        <input
          defaultValue={q}
          // autoFocus
          type="text"
          placeholder="Find a user"
          style={inputStyles}
          // onChange={(e) => {}}
        />
        <button
          type="submit"
          style={{
            marginLeft: "24px",
            height: "max-content",
            padding: "11px 20px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Hit Enter
        </button>
      </form>
    </Container>
  );
}

export default SearchForUser;
