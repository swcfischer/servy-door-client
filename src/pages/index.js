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
import FilterToggle, { replaceSpaceWithPlus } from "../components/FilterToggle";
import axios from "axios";

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

export default function Index(props) {
  const { search } = props.location;
  const params = new URLSearchParams(search);
  const qParam = params.get("q") ?? "";
  const fParam = params.get("f") ?? "all";
  const iParam = Number(params.get("i")) ?? 0;
  const [books, setBooks] = useState([]);
  const [toggle, setToggle] = useState(fParam);
  const [q, setQ] = useState(qParam);
  const [totalItems, setTotalItems] = useState(0);

  const sortedBookList = books
    // .sort((a, b) => {
    //   return (
    //     new Date(b.volumeInfo.publishedDate) -
    //     new Date(a.volumeInfo.publishedDate)
    //   );
    // })
    .filter((book) => {
      if (toggle === "all") {
        return true;
      } else if (toggle === "title") {
        return book.volumeInfo.title.toLowerCase().includes(q.toLowerCase());
      } else if (toggle === "author") {
        return book.volumeInfo.authors?.some((author) =>
          author.toLowerCase().includes(q.toLowerCase())
        );
      }
      return false;
    });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          volumesGet + "?q=" + q + "&startIndex=" + iParam
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
  }, [q, iParam]);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ padding: "0 !important" }}>
        <Box sx={{ my: 3 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQ(document.querySelector("input").value);

              navigate(
                `/?q=${replaceSpaceWithPlus(
                  document.querySelector("input").value
                )}&f=${replaceSpaceWithPlus(toggle)}`
              );
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

          <FilterToggle q={q} toggle={toggle} setToggle={setToggle} />

          <Grid container spacing={4}>
            {sortedBookList.slice(0, 9).map(({ id, volumeInfo }) => (
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
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          {Boolean(totalItems) && <div>{totalItems}</div>}
          {Boolean(totalItems) && (
            <div>
              <ul>
                <li>
                  <Link to={"/?q=" + replaceSpaceWithPlus(q) + "&startIndex=9"}>
                    2
                  </Link>
                </li>
                <li>
                  <Link>3</Link>
                </li>
                <li>
                  <Link>4</Link>
                </li>
                <li>
                  <Link>5</Link>
                </li>
                <li>
                  <Link>6</Link>
                </li>
              </ul>
            </div>
          )}
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
