import React from "react";
import Select from "react-select";
import { buildQueryParams } from "../utils/queryFunctions";
import { navigate } from "gatsby";

const options = [
  { value: "none", label: "No Filter" },
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "publisher", label: "Publisher" },
  { value: "subject", label: "Subject" },
];

const FilterSelect = (props) => {
  const { searchFilter, setSearchFilter, setQ } = props;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#d4c066", // Darker than #f9e699ff
      borderColor: state.isFocused ? "#b8a04a" : "#c4b05c",
      boxShadow: state.isFocused ? "0 0 0 1px #b8a04a" : null,
      "&:hover": {
        borderColor: "#b8a04a",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#d4c066",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#b8a04a"
        : state.isFocused
        ? "#c4b05c"
        : "#d4c066",
      color: "#333",
      "&:hover": {
        backgroundColor: "#c4b05c",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#666",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#222",
      "&:hover": {
        color: "#222",
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#222",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#222",
      "&:hover": {
        color: "#222",
      },
    }),
  };

  const handleChange = (selectedOptions) => {
    setSearchFilter(selectedOptions);

    const q = document.querySelector("input").value;

    setQ(q);

    navigate(
      `/?${buildQueryParams({
        q,
        page: 1,
        searchFilter: selectedOptions?.value,
      })}`
    );
  };

  return (
    <div style={{ width: "195px", marginBottom: "12px" }}>
      <label
        style={{ paddingBottom: "8px", display: "inline-block" }}
        htmlFor="filter-by"
        id="filter-by-label"
      >
        Filter by:
      </label>
      <Select
        aria-labelledby="filter-by-label"
        placeholder="No filter necessary"
        inputId="filter-by"
        name="filter-by"
        options={options}
        defaultValue={searchFilter}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
        onChange={handleChange}
      />
    </div>
  );
};

export default FilterSelect;
