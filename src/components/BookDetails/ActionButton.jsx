import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

function ActionButton(props) {
  const { options } = props;

  return (
    <Menu
      menuButton={
        <MenuButton>
          Actions{" "}
          <span
            style={{
              fontSize: "20px",
              lineHeight: "12px",
              fontWeight: "bold",
            }}
            aria-hidden
          >
            ▾
          </span>
        </MenuButton>
      }
      transition
      menuStyles={{ border: "1px solid #ccc", boxShadow: "none" }}
    >
      {options.map((el, idx) => {
        return (
          <MenuItem key={idx} onClick={el.action}>
            {el.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

export default ActionButton;
