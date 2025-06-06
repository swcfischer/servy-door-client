import React from "react";
import { Tooltip } from "@mui/material";

function PageRange(props) {
  const { pageRange = [1, 20], setPageRange } = props;

  return (
    <h2>
      Notes
      <span style={{ fontSize: "0.6em", fontWeight: "normal" }}>
        {" "}
        ({" "}
        <input
          type="number"
          value={pageRange[0]}
          min="1"
          style={{ width: "50px" }}
          onChange={(e) =>
            setPageRange([Math.max(0, Number(e.target.value)), pageRange[1]])
          }
        />{" "}
        -{" "}
        <input
          type="number"
          value={pageRange[1]}
          min={Math.max(0, pageRange[0])}
          style={{ width: "50px" }}
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
  );
}

export default PageRange;
