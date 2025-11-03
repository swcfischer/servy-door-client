import React from "react";
import { Tooltip } from "@mui/material";
import styled from "@emotion/styled";

const StyledContainer = styled.div`
  input {
    width: 50px;
    background-color: #222;
    border: 1px solid #5e5e5e;
    border-radius: 3px;
    padding: 4px 8px;
    color: #d4c066;
    font-family: inherit;
    transition: all 0.3s ease;

    &:hover {
      border-color: #7e7e7e;
    }

    &:focus {
      outline: 2px solid #d4c066;
      outline-offset: 2px;
      border-color: #d4c066;
    }
  }
`;

function PageRange(props) {
  const { pageRange = [1, 20], setPageRange } = props;

  return (
    <StyledContainer>
      <h2>
        Notes
        <span style={{ fontSize: "0.6em", fontWeight: "normal" }}>
          {" "}
          ({" "}
          <input
            type="number"
            value={pageRange[0]}
            min="1"
            onChange={(e) =>
              setPageRange([Math.max(0, Number(e.target.value)), pageRange[1]])
            }
          />{" "}
          -{" "}
          <input
            type="number"
            value={pageRange[1]}
            min={Math.max(0, pageRange[0])}
            onChange={(e) =>
              setPageRange([pageRange[0], Math.max(0, Number(e.target.value))])
            }
          />{" "}
          )
        </span>
        <Tooltip
          title={
            <span style={{ fontSize: "1.2em" }}>
              Enter a range (percentage or page) for this reading session
            </span>
          }
        >
          <span
            style={{
              fontSize: "0.7em",
              fontWeight: "normal",
              position: "relative",
              left: "10px",
              cursor: "default",
              top: "3px",
            }}
          >
            ⓘ
          </span>
        </Tooltip>
      </h2>
    </StyledContainer>
  );
}

export default PageRange;
