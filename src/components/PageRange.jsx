import React from "react";
import { Tooltip } from "@mui/material";

function PageRange(props) {
  const { pageRange, setPageRange } = props;

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
          onChange={(e) =>
            setPageRange([Math.max(0, Number(e.target.value)), pageRange[1]])
          }
          style={{ width: "50px" }}
        />{" "}
        -{" "}
        <input
          type="number"
          value={pageRange[1] || 20}
          min={Math.max(0, pageRange[0])}
          onChange={(e) =>
            setPageRange([pageRange[0], Math.max(0, Number(e.target.value))])
          }
          style={{ width: "50px" }}
        />{" "}
        )
      </span>
      <Tooltip title="Enter the page range or percent range for reading session">
        <span
          style={{
            fontSize: "0.4em",
            fontWeight: "normal",
            position: "relative",
            left: "10px",
            cursor: "default",
            top: "1px",
          }}
        >
          ⓘ
        </span>
      </Tooltip>
    </h2>
  );
}

export default PageRange;
