// * Book List (HomePage)

import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { Link, navigate } from "gatsby";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import FilterSelect from "../components/FilterSelect";
import { buildQueryParams, searchBooks } from "../utils/queryFunctions";

const volumesGet = "https://www.googleapis.com/books/v1/volumes";

const inputStyles = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #000",
  backgroundColor: "#1c1e20",
  color: "#fff",
  boxSizing: "border-box",
  maxWidth: "75%",
  display: "block",
  boxShadow: "var(--Paper-shadow)",
};

const cardStyles = {
  display: "flex",
  boxShadow: "none",
  background: "transparent",
};

const itemsPerPage = 9;

function getStartIndex(page) {
  return (page - 1) * itemsPerPage;
}

function getPathForNavigate(q, page) {
  return "?q=" + replaceForURL(q) + "&page=" + page;
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

  const searchFilterObj = {
    label: _searchFilter ? capitalize(_searchFilter) : "No Filter",
    value: _searchFilter ?? "none",
  };

  const [q, setQ] = useState(qParam);
  const [totalItems, setTotalItems] = useState(0);
  const [searchFilter, setSearchFilter] = useState(searchFilterObj);

  useEffect(() => {
    const fetchBooks = async () => {
      const getPath =
        volumesGet +
        "?" +
        buildQueryParams({
          q: searchBooks(removeSearchOperators(q), searchFilter.value),
          startIndex: getStartIndex(pageParam),
          searchFilter: searchFilter.value,
        });
      try {
        const response = await axios.get(getPath);
        setBooks(response?.data?.items ?? []);
        setTotalItems(response.data.totalItems);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    if (q) {
      fetchBooks();
    } else {
      setBooks([]);
      setTotalItems(0);
    }
  }, [q, pageParam, searchFilter.value]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const _newQ = document.querySelector("input").value;
    const newQ = searchBooks(_newQ, searchFilter.value);
    if (q !== _newQ) {
      setQ(_newQ);

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
    <Container maxWidth="md" sx={{ padding: "0 !important" }}>
      <Box sx={{ my: 3 }}>
        <form
          onSubmit={handleOnSubmit}
          style={{
            display: "flex",
          }}
        >
          <input
            defaultValue={q}
            autoFocus
            type="text"
            placeholder="Find a book"
            style={inputStyles}
            // onChange={(e) => {}}
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
              backgroundColor: "#333",
              color: "#fff",
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
            q={q}
          />

          {books.length > 0 && (
            <>
              <Pagination
                onChange={(e, value) => {
                  navigate(
                    `/?${buildQueryParams({
                      q: q,
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

        <div style={{ minHeight: "110vh" }}>
          <Grid container spacing={4}>
            {books.slice(0, 9).map(({ id, volumeInfo }) => (
              <Grid className="fade-in" item xs={12} sm={6} md={4} key={id}>
                <Link
                  to={`/book?id=${id}`}
                  style={{ textDecoration: "none" }}
                  className="fade-in-book-item"
                  onMouseEnter={(e) => {
                    e.currentTarget
                      .querySelectorAll(".hover-underline")
                      .forEach((el) => {
                        el.style.textDecoration = "underline";
                      });
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget
                      .querySelectorAll(".hover-underline")
                      .forEach((el) => {
                        el.style.textDecoration = "none";
                      });
                  }}
                >
                  <Card sx={cardStyles}>
                    <CardMedia
                      component="img"
                      image={volumeInfo.imageLinks?.thumbnail}
                      alt={volumeInfo.title}
                      sx={{
                        objectFit: "contain",
                        pt: 2,
                        width: "100px",
                        height: "150px",
                        color: "#fafafa",
                        borderRadius: "3px",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontStyle: "italic", lineHeight: 1.2 }}
                        className="hover-underline"
                        title={isOver(volumeInfo.title, 40) && volumeInfo.title}
                      >
                        {handleTitleLength(volumeInfo.title)}
                      </Typography>
                      <br />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="hover-underline"
                        title={
                          volumeInfo.authors?.length > 2 &&
                          volumeInfo.authors?.join(", ")
                        }
                      >
                        {volumeInfo.authors?.length > 2 ? (
                          <>{volumeInfo.authors?.slice(0, 2).join(", ")}</>
                        ) : (
                          volumeInfo.authors?.join(", ")
                        )}
                      </Typography>
                      ---
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="hover-underline"
                        title={
                          isOver(volumeInfo.publisher, 40) &&
                          volumeInfo.publisher
                        }
                      >
                        {volumeInfo.publisher}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="hover-underline"
                      >
                        {formatDate(volumeInfo.publishedDate)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
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
              navigate(
                `/?${buildQueryParams({
                  q: q,
                  page: value,
                  searchFilter: searchFilter?.value ?? "none",
                })}`
              );
            }}
            page={pageParam}
            count={totalItems > 500 ? 50 : Math.ceil(totalItems / itemsPerPage)}
            variant="outlined"
            shape="rounded"
          />
          <br />
          <br />
        </div>
      )}
    </Container>
  );
}

function handleTitleLength(text = "") {
  if (isOver(text, 40)) {
    return text.slice(0, 40) + "...";
  }
  return text;
}

function isOver(text = "", length) {
  return text.length > length;
}

function formatDate(dateString) {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return the original string if it's not a valid date
  }

  return date.getFullYear().toString();
}

function replaceForURL(text) {
  return text.replaceAll(" ", "+").replaceAll('"', "%22");
}

export function removeSearchOperators(str) {
  // Matches any of inauthor:, insubject:, intitle:, inpublisher:
  // The \b ensures we match the word boundary,
  // and the : ensures we remove the colon as well.
  return str.replace(/\b(inauthor|insubject|intitle|inpublisher):/gi, "");
}
