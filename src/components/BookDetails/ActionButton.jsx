import React from "react";
import { Menu, MenuItem, MenuButton, MenuDivider } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

/**
 * ActionButton component renders a dropdown menu with a list of actions.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.options - An array of option objects for the menu.
 * @param {string} props.options[].label - The label for the menu item.
 * @param {Function} props.options[].action - The function to call when the menu item is clicked.
 *
 * @returns {JSX.Element} The rendered ActionButton component.
 */
function ActionButton(props) {
  const { options } = props;

  return (
    <Menu
      menuButton={
        <MenuButton style={{ fontFamily: "inherit" }}>
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
        if (el.isMenuDivider) {
          return <MenuDivider />;
        }
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
