import React from "react";
import Select from "react-select";

const options = [
  { value: "none", label: "No Filter" },
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "publisher", label: "Publisher" },
  { value: "subject", label: "Subject" },
];

const FilterSelect = (props) => {
  const { searchFilter, setSearchFilter } = props;

  const handleChange = (selectedOptions) => {
    setSearchFilter(selectedOptions);
  };

  return (
    <div style={{ width: "195px", marginBottom: "12px" }}>
      <label
        style={{ paddingBottom: "8px", display: "inline-block" }}
        htmlFor="filter-by"
      >
        Filter by:
      </label>
      <Select
        placeholder="No filter necessary"
        id="filter-by"
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
