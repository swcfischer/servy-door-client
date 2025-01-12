// * Book List (HomePage)

import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import bookList from "../example2.json";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Layout from "../components/Layout"; // Import the new Layout component
import { Link, navigate } from "gatsby";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

const volumesGet = "https://www.googleapis.com/books/v1/volumes";

const inputStyles = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "20px",
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

function getPathWithQueryParams(q, page) {
  if (Number(page) === 1) {
    return "?q=" + replaceForURL(q) + "&startIndex=0";
  } else {
    return (
      "?q=" + replaceForURL(q) + "&startIndex=" + (page - 1) * itemsPerPage
    );
  }
}

function getPathForNavigate(q, page) {
  return "?q=" + replaceForURL(q) + "&page=" + page;
}

export default function Index(props) {
  const { search } = props.location;
  const params = new URLSearchParams(search);
  const qParam = params.get("q") ?? "";
  const pageParam = Number(params.get("page")) ?? 1;
  const [books, setBooks] = useState([]);

  const [q, setQ] = useState(qParam);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          volumesGet + getPathWithQueryParams(q, pageParam)
        );
        setBooks(response.data.items);
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
  }, [q, pageParam]);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ padding: "0 !important" }}>
        <Box sx={{ my: 3 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newQ = document.querySelector("input").value;
              if (q !== newQ) {
                setQ(newQ);

                navigate(`/${getPathForNavigate(newQ, 1)}`);
              }
            }}
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
              onChange={(e) => {}}
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

          {books.length > 0 && (
            <>
              <Pagination
                onChange={(e, value) => {
                  navigate(`/${getPathForNavigate(q, value)}`);
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

          <Grid container spacing={4}>
            {books.slice(0, 9).map(({ id, volumeInfo }) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Link
                  to={`/book?id=${id}`}
                  style={{ textDecoration: "none" }}
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
                          isOver(volumeInfo.authors?.join(", "), 40) &&
                          volumeInfo.authors?.join(", ")
                        }
                      >
                        {volumeInfo.authors?.join(", ")}
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
        </Box>
      </Container>
    </Layout>
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
