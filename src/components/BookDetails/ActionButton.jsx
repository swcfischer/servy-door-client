import React from "react";
import { Menu, MenuItem, MenuButton, MenuDivider } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { SubMenu } from "@szhsin/react-menu";
import styled from "@emotion/styled";

const StyledMenuContainer = styled.div`
  .szh-menu__button,
  button[type="button"] {
    font-family: inherit !important;
    background-color: #222 !important;
    border: 1px solid #5e5e5e !important;
    border-radius: 3px !important;
    color: #d4c066 !important;
    padding: 8px 12px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-size: 16px !important;
    min-height: auto !important;

    &:hover {
      background-color: #333 !important;
      border-color: #7e7e7e !important;
    }

    &:focus {
      outline: 2px solid #d4c066 !important;
      outline-offset: 2px !important;
    }

    &:active {
      background-color: #333 !important;
    }
  }

  /* More specific targeting */
  > div > button,
  [role="button"] {
    font-family: inherit !important;
    background-color: #222 !important;
    border: 1px solid #5e5e5e !important;
    border-radius: 3px !important;
    color: #d4c066 !important;
    padding: 8px 12px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-size: 16px !important;

    &:hover {
      background-color: #333 !important;
      border-color: #7e7e7e !important;
    }
  }

  .szh-menu {
    background-color: #222 !important;
    border: 1px solid #5e5e5e !important;
    border-radius: 3px !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
  }

  .szh-menu__item {
    background-color: #222 !important;
    color: #d4c066 !important;
    padding: 8px 16px !important;
    font-size: 14px !important;
    border: none !important;

    &:hover {
      background-color: #333 !important;
      color: #d4c066 !important;
    }

    &:focus {
      background-color: #333 !important;
      color: #d4c066 !important;
      outline: none !important;
    }
  }

  .szh-menu__divider {
    border-color: #5e5e5e !important;
    margin: 4px 0 !important;
  }

  .szh-menu__submenu .szh-menu__item {
    background-color: #222 !important;
    color: #d4c066 !important;

    &:hover {
      background-color: #333 !important;
      color: #d4c066 !important;
    }
  }
`;

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
    <StyledMenuContainer>
      <Menu
        transition
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
      >
        {options.map(renderMenuItem)}
      </Menu>
    </StyledMenuContainer>
  );
}

export default ActionButton;
