import React from "react";
import Select from "react-select";

const options = [
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
    <div style={{ width: "395px", marginBottom: "12px" }}>
      <label
        style={{ paddingBottom: "8px", display: "inline-block" }}
        htmlFor="flavors"
      >
        Select Filters (Not required)
      </label>
      <Select
        id="flavors"
        isMulti
        name="flavors"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
      />
    </div>
  );
};

export default FilterSelect;
