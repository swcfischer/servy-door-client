import React from "react";
import styled from "@emotion/styled";
import bestsellerList from "../constants/bestsellers";
import BestsellerItem from "./BestsellerItem";
import { BsDoorOpen } from "react-icons/bs";

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.isLoading ? 0 : 1)};

  .besterseller-list__title {
    padding-top: 0;
    margin-top: 0;
    font-style: italic;
    font-weight: normal;
    font-size: 32px;
    display: flex;
    align-items: center;

    .bestseller-list__icon {
      position: relative;
      top: 4px;
      display: inline-block;
      padding-left: 12px;
      padding-right: 12px;
      font-size: 22px;
      width: min-content;
      margin: 0 auto;
    }
  }
`;

function BestSellerList(props) {
  const { isLoading } = props;

  return (
    <Container className="bestseller-list" isLoading={isLoading}>
      <h2 className="besterseller-list__title">
        <span className="bestseller-list__icon">
          <BsDoorOpen />
        </span>
        Reading Opens Doors!
        <span className="bestseller-list__icon">
          <BsDoorOpen />
        </span>
      </h2>

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
