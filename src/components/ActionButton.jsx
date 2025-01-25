import React from "react";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

/**
 * @typedef {Object} Option
 * @property {string} label - The label of the menu item.
 * @property {string} action - The action to be performed when the menu item is selected.
 */

/**
 * @param {Object} props - The properties object.
 * @param {Option[]} props.options - The list of options to be displayed in the menu.
 */
function ActionButton(props) {
  const { options } = props;

  return (
    <Menu>
      <MenuButton>
        Actions <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList>
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onSelect={option.action}
            style={{ fontSize: "1.25em" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default ActionButton;
