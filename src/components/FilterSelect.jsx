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
        onChange={handleChange}
      />
    </div>
  );
};

export default FilterSelect;
