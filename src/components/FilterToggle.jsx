import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { navigate } from "gatsby";
import React from "react";

function FilterToggle(props) {
  const { toggle, setToggle, q } = props;

  return (
    <div>
      <p style={{ color: "gray", fontFamily: "monospace" }}>Filter exact:</p>
      <ToggleButtonGroup
        exclusive
        aria-label="filter"
        sx={{ mb: 2 }}
        value={toggle}
        onChange={(e) => {
          setToggle(e.target.value);
          navigate(
            `/?q=${replaceSpaceWithPlus(q)}&f=${replaceSpaceWithPlus(
              e.target.value
            )}`
          );
        }}
      >
        <ToggleButton value="all" aria-label="all">
          All
        </ToggleButton>
        <ToggleButton value="title" aria-label="title">
          Title
        </ToggleButton>
        <ToggleButton value="author" aria-label="author">
          Author
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export function replaceSpaceWithPlus(text) {
  return text.replaceAll(" ", "+");
}

export default FilterToggle;
