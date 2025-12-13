import React from "react";
import Select from "react-select";
import { buildQueryParams } from "../utils/queryFunctions";
import { navigate } from "gatsby";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  align-items: center;

  width: ${({ isFullWidth }) => (isFullWidth ? "100%" : "max-content")};

  #trending-search {
    margin: 12px 0 0 20px;
    font-size: 24px;
    font-weight: bold;
    font-style: italic;

    a {
      color: #222;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const options = [
  { value: "none", label: "No Filter" },
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "publisher", label: "Publisher" },
  { value: "subject", label: "Subject" },
];

const FilterSelect = (props) => {
  const {
    searchFilter,
    setSearchFilter,
    setQ,
    books,
    q,
    params,
    wasSearchDone,
  } = props;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#212121",
      borderColor: state.isFocused ? "#424242" : "#303030",
      boxShadow: state.isFocused ? "0 0 0 1px #424242" : null,
      "&:hover": {
        borderColor: "#424242",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#212121",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#424242"
        : state.isFocused
        ? "#303030"
        : "#212121",
      color: "#d4c066",
      "&:hover": {
        backgroundColor: "#303030",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#d4c066",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#bbb",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#d4c066",
      "&:hover": {
        color: "#d4c066",
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#d4c066",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#d4c066",
      "&:hover": {
        color: "#d4c066",
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
    <Container isFullWidth={!wasSearchDone(books, q, params)}>
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

      <AvidTrending
        wasSearchDone={wasSearchDone}
        books={books}
        q={q}
        params={params}
        handleChange={handleChange}
      />
      {/* <Trending
        wasSearchDone={wasSearchDone}
        books={books}
        q={q}
        params={params}
        handleChange={handleChange}
      /> */}
    </Container>
  );
};

export default FilterSelect;

function Trending(props) {
  const { wasSearchDone, books, q, params, handleChange } = props;

  if (!wasSearchDone(books, q, params)) {
    return (
      <div id="trending-search">
        <a
          href="https://servydoor.com/?q=Jerry+Seinfeld&page=1&searchFilter=author"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            document.querySelector("input").value = "Jerry Seinfeld";

            handleChange({
              value: "author",
              label: "Author",
            });
          }}
        >
          Trending...
        </a>
      </div>
    );
  }
}

function AvidTrending(props) {
  const { wasSearchDone, books, q, params, handleChange } = props;

  if (!wasSearchDone(books, q, params)) {
    return (
      <div id="Accessible YouTube" style={{ marginLeft: "12px" }}>
        <a
          href="https://www.avidlanguagelearning.com/app/video/5ffed861-e3f1-4c3e-8d62-3d39ffebc4f2"
          target="_blank"
        >
          YouTube Viewer
        </a>
      </div>
    );
  }
}
