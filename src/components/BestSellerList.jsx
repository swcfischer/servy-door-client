import React from "react";
import styled from "@emotion/styled";
import bestsellerList from "../constants/bestsellers";
import BestsellerItem from "./BestsellerItem";

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.isLoading ? 0 : 1)};
`;

function BestSellerList(props) {
  const { isLoading } = props;
  return (
    <Container>
      <h2 style={{ paddingTop: "0", marginTop: "0" }}>Bestsellers</h2>

      <div className="book-list-container">
        {bestsellerList.map(({ id, volumeInfo }) => (
          <BestsellerItem
            key={id}
            volumeInfo={volumeInfo}
            id={id}
            to={`/book?id=${id}`}
          />
        ))}
      </div>
    </Container>
  );
}

export default BestSellerList;
