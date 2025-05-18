import React from "react";
import { Menu, MenuItem, MenuButton, MenuDivider } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { SubMenu } from "@szhsin/react-menu";

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
  // Helper to render menu items, supporting submenus and dividers
  const renderMenuItem = (el, idx) => {
    if (el.isMenuDivider) {
      return <MenuDivider key={idx} />;
    }
    if (el.subMenu && Array.isArray(el.subMenu)) {
      return (
        <SubMenu label={el.label} key={idx}>
          {el.subMenu.map(renderMenuItem)}
        </SubMenu>
      );
    }
    return (
      <MenuItem key={idx} onClick={el.action}>
        {el.label}
      </MenuItem>
    );
  };

  return (
    <Menu
      transition
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
    >
      {options.map(renderMenuItem)}
    </Menu>
  );
}

export default ActionButton;
