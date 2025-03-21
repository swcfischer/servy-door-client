import React from "react";
import styled from "@emotion/styled";
import classicBestsellerList from "../bookLists/classicBestSellers";
import BestsellerItem from "./BestsellerItem";

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.isLoading ? 0 : 1)};

  .besterseller-list__title {
    padding-top: 0;
    margin-top: 0;
    font-style: italic;
    font-weight: normal;
    font-size: 40px;
    /* font-size: 26px; */
    align-items: center;
    text-align: center;
    width: 100%;
    font-family: Tangerine;
  }
`;

function ClassicBestSellerList(props) {
  const { isLoading } = props;

  return (
    <Container className="bestseller-list" isLoading={isLoading}>
      <h2 className="besterseller-list__title">Reading Opens Doors!</h2>

      <div className="book-list-container">
        {classicBestsellerList.map(({ id, volumeInfo }) => (
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

export default ClassicBestSellerList;
