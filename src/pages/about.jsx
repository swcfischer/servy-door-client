import React from "react";

import styled from "@emotion/styled";

const Container = styled.div`
  h1 {
    text-align: center;
  }

  p {
    font-size: 20px;
    max-width: 370px;
    margin: 0 auto;
    line-height: 28px;
  }
`;

function About(props) {
  return (
    <Container>
      <h1>About ServyDoor</h1>
      <p>
        Welcome to <strong>ServyDoor</strong>, your ultimate reading companion!{" "}
        <strong>ServyDoor</strong> is a powerful application designed to help
        you bookmark your favorite <strong>books</strong>, stay on track with
        your progress, and keep detailed notes for each reading session.
      </p>
      <br />

      <p>
        Whether you're a casual reader or an avid book-lover,{" "}
        <strong>ServyDoor</strong> is here to enhance your reading experience.
      </p>
    </Container>
  );
}

export default About;
