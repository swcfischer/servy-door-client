import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

function ActionButton(props) {
  const { options } = props;

  return (
    <Menu
      menuButton={<MenuButton>Actions</MenuButton>}
      transition
      menuStyles={{ border: "1px solid #ccc", boxShadow: "none" }}
    >
      <MenuItem onClick={() => alert("Action 1")}>Action 1</MenuItem>
      <MenuItem onClick={() => alert("Action 2")}>Action 2</MenuItem>
      <MenuItem onClick={() => alert("Action 3")}>Action 3</MenuItem>
    </Menu>
  );
}

export default ActionButton;
