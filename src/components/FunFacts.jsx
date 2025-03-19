import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import styled from "@emotion/styled";

const Container = styled.div`
  h3 {
    font-size: 16px;
    padding-top: 24px;
    padding-bottom: 0px;
  }

  ul {
    margin: 0;
    padding: 0;
    padding-right: 42px;

    li:first-of-type {
      padding-top: 0;
    }

    li {
      padding-top: 25px;
      list-style: none;
      max-width: 400px;
      margin: 0 auto;

      & > div {
        display: flex;
        justify-content: flex-end;
        padding-right: 25px;
      }
    }
  }
`;

function FunFacts(props) {
  const { description, title, author, googleId } = props;

  const [funFacts, setFunFacts] = useState([]);

  useEffect(() => {
    if (description && title && author) {
      async function fetchFacts() {
        try {
          const queryParams = new URLSearchParams({
            title,
            author,
            description,
          }).toString();
          const { data } = await axiosInstance.get(
            `/fun-facts/create-fun-fact/${googleId}?${queryParams}`
          );

          setFunFacts(JSON.parse(data.facts));

          if (data.error) {
            console.log(data.error);
          }
        } catch (err) {
          console.log(err);
        }
      }

      fetchFacts();
    }
  }, [description, title, author, googleId]);

  if (!funFacts.length) {
    return <div style={{ height: "400px" }}></div>;
  }

  return (
    <Container>
      <h3>Fun Facts</h3>
      <ul>
        {funFacts.map((item) => {
          return (
            <li>
              {item.fact}
              <br />

              <div>
                <small>
                  <a href={item.source} target="_blank" rel="noreferrer">
                    Source
                  </a>
                </small>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

export default FunFacts;
