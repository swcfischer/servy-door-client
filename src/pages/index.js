// * Book List (HomePage)

import React, { useContext, useEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { navigate } from "gatsby";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import FilterSelect from "../components/FilterSelect";
import { buildQueryParams, searchBooks } from "../utils/queryFunctions";
import {
  searchGoogleBooks,
  searchGoogleBooksPublic,
} from "../utils/googleBooksApi";
import BookItem from "../components/BookItem";
import styled from "@emotion/styled";
import ClassicBestSellerList from "../components/ClassicBestSellerList";
import { UserContext } from "../components/Layout";

const EmotionContainer = styled.div`
  min-height: 400vh;

  button {
    font-family: inherit;
  }

  .search-book-list {
  }

  .book-list-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  /* Use two columns when in search mode */
  .search-book-list .book-list-container {
    grid-template-columns: repeat(2, 1fr);
  }

  input {
    font-family: inherit;
  }

  input::placeholder {
    color: #d4c066;
  }

  input:focus {
    outline: 1px solid #000000ac;
    outline-offset: 0px;
  }

  @media (max-width: 600px) {
    .book-list-container {
      grid-template-columns: 1fr;
    }
  }
`;

const volumesGet = "https://www.googleapis.com/books/v1/volumes";

const inputStyles = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid darkgoldenrod",
  backgroundColor: "#1c1e20",
  color: "#d4c066",
  boxSizing: "border-box",
  maxWidth: "75%",
  display: "block",
  boxShadow: "var(--Paper-shadow)",
};

const itemsPerPage = 6;

function getStartIndex(page) {
  return (page - 1) * itemsPerPage;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Index(props) {
  const { search } = props.location;
  const params = new URLSearchParams(search);
  const qParam = params.get("q") ?? "";
  const _searchFilter = params.get("searchFilter");
  const pageParam = params.get("page") ? Number(params.get("page")) : 1;
  const [books, setBooks] = useState([]);
  const { user } = useContext(UserContext);

  const searchFilterObj = {
    label: _searchFilter ? capitalize(_searchFilter) : "No Filter",
    value: _searchFilter ?? "none",
  };

  const [q, setQ] = useState(qParam);
  const [totalItems, setTotalItems] = useState(0);
  const [searchFilter, setSearchFilter] = useState(searchFilterObj);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (qParam === "") {
      setBooks([]);
      setTotalItems(0);
      setQ("");
    }
  }, [qParam, q]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);

      const queryParams = {
        q: searchBooks(removeSearchOperators(q), searchFilter?.value),
        startIndex: getStartIndex(pageParam),
        maxResults: itemsPerPage,
      };

      try {
        let response;

        // Use authenticated API if user has Google OAuth token
        if (user?.uuid && user?.googleId && !user.isLoading) {
          response = await searchGoogleBooks(user.uuid, queryParams);
        } else {
          // Fallback to public API for anonymous users
          response = await searchGoogleBooksPublic(queryParams);
        }

        setBooks(response?.items ?? []);
        setTotalItems(response.totalItems);
      } catch (error) {
        console.error("Error fetching books:", error);

        // If authenticated request fails, try fallback to public API
        if (error.response?.status === 401 && user?.uuid) {
          console.log("Falling back to public API");
          try {
            const response = await searchGoogleBooksPublic(queryParams);
            setBooks(response?.items ?? []);
            setTotalItems(response.totalItems);
          } catch (fallbackError) {
            console.error("Fallback API also failed:", fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (q) {
      fetchBooks();
    } else {
      setBooks([]);
      setTotalItems(0);
      setIsLoading(false);
    }
  }, [
    q,
    pageParam,
    searchFilter?.value,
    user?.uuid,
    user?.googleId,
    user?.isLoading,
  ]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const _newQ = document.querySelector("input").value;
    const newQ = searchBooks(_newQ, searchFilter.value);
    if (q !== _newQ) {
      setQ(newQ);

      navigate(
        `/?${buildQueryParams({
          q: _newQ,
          page: 1,
          searchFilter: searchFilter?.value ?? "none",
        })}`
      );
    }
  };

  return (
    <EmotionContainer
      className={wasSearchDone(books, q, params) ? "search-book-list" : ""}
    >
      <Container maxWidth="md" sx={{ padding: "0 !important" }}>
        <Box sx={{ my: 3 }}>
          <form
            onSubmit={handleOnSubmit}
            style={{
              display: "flex",
            }}
          >
            <label
              htmlFor="book-search-input"
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                border: 0,
              }}
            >
              Find a book
            </label>
            <input
              id="book-search-input"
              defaultValue={q}
              type="text"
              placeholder="Find a book"
              style={inputStyles}
              aria-autocomplete="none"
              autocomplete="off"
              autoFocus
            />
            <button
              type="submit"
              style={{
                marginLeft: "24px",
                height: "max-content",
                padding: "11px 20px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "rgb(33, 33, 33)",
                color: "#d4c066",
                cursor: "pointer",
              }}
            >
              Hit Enter
            </button>
          </form>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FilterSelect
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setQ={setQ}
              wasSearchDone={wasSearchDone}
              books={books}
              q={q}
              params={params}
            />

            {books.length > 0 && Math.ceil(totalItems / itemsPerPage) > 1 && (
              <>
                <Pagination
                  style={{
                    marginTop: "15px",
                  }}
                  onChange={(e, value) => {
                    setQ(q || qParam);
                    navigate(
                      `/?${buildQueryParams({
                        q: q || qParam,
                        page: value,
                        searchFilter: searchFilter?.value ?? "none",
                      })}`
                    );
                  }}
                  page={pageParam}
                  count={
                    totalItems > 500 ? 50 : Math.ceil(totalItems / itemsPerPage)
                  }
                  variant="outlined"
                  shape="rounded"
                />
                <br />
                <br />
              </>
            )}
          </div>

          <div style={{ minHeight: "80vh", paddingTop: "30px" }}>
            {wasSearchDone(books, q, params) ? (
              <div className="book-list-container">
                {books.slice(0, itemsPerPage).map(({ id, volumeInfo }) => (
                  <BookItem
                    key={id}
                    volumeInfo={volumeInfo}
                    id={id}
                    to={`/book?id=${id}`}
                  />
                ))}
              </div>
            ) : (
              <ClassicBestSellerList isLoading={isLoading} />
            )}
          </div>
        </Box>

        {books.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              onChange={(e, value) => {
                setQ(q || qParam);
                navigate(
                  `/?${buildQueryParams({
                    q: q || qParam,
                    page: value,
                    searchFilter: searchFilter?.value ?? "none",
                  })}`
                );
              }}
              page={pageParam}
              count={
                totalItems > 500 ? 50 : Math.ceil(totalItems / itemsPerPage)
              }
              variant="outlined"
              shape="rounded"
            />
            <br />
            <br />
          </div>
        )}
      </Container>
    </EmotionContainer>
  );
}

function wasSearchDone(books, query, params) {
  return books.length > 0 || params.toString().length > 0;
}

function removeSearchOperators(str) {
  // Matches any of inauthor:, insubject:, intitle:, inpublisher:
  // The \b ensures we match the word boundary,
  // and the : ensures we remove the colon as well.
  return str.replace(/\b(inauthor|insubject|intitle|inpublisher):/gi, "");
}
