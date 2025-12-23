import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import classicBestsellerList from "../bookLists/classicBestSellers";
import BestsellerItem from "./BestsellerItem";

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.isLoading ? 0 : 1)};
  height: ${(props) => props.height};

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

  // * Grab from localstorage

  const bestSellerHeight = localStorage.getItem("bestseller-height")
    ? `${localStorage.getItem("bestseller-height")}px`
    : "100%";

  return (
    <Container
      className="bestseller-list"
      isLoading={isLoading}
      height={bestSellerHeight}
    >
      {/* <h2 className="besterseller-list__title">Reading Opens Doors!</h2> */}

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
