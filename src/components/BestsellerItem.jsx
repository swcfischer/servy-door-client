import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";

const cardStyles = {
  display: "flex",
  boxShadow: "none",
  background: "transparent",
};

function BookItem(props) {
  const { volumeInfo, id, to } = props;

  return (
    <Grid className="fade-in" item xs={12} sm={6} md={4} key={id}>
      <Link
        to={to}
        style={{ textDecoration: "none" }}
        className="fade-in-book-item"
        onMouseEnter={(e) => {
          e.currentTarget.querySelectorAll(".hover-underline").forEach((el) => {
            el.style.textDecoration = "underline";
          });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelectorAll(".hover-underline").forEach((el) => {
            el.style.textDecoration = "none";
          });
        }}
      >
        <Card sx={cardStyles}>
          <ImageCard
            imageUrl={volumeInfo.imageLinks?.thumbnail}
            title={volumeInfo.title}
          />

          <CardContent sx={{ paddingTop: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontStyle: "italic", lineHeight: 1.2 }}
              className="hover-underline"
              // title={handleTitleLength(volumeInfo.title)}
            >
              {handleTitleLength(volumeInfo.title)}
            </Typography>
            <br />
            <Typography
              variant="body2"
              color="textSecondary"
              className="hover-underline"
              // title={volumeInfo.authors?.join(", ")}
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
              // title={volumeInfo.publisher}
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
  );
}

export default BookItem;

function formatDate(dateString) {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return the original string if it's not a valid date
  }

  return date.getFullYear().toString();
}

function isOver(text = "", length) {
  return text.length > length;
}

function handleTitleLength(text = "") {
  if (isOver(text, 40)) {
    return text.slice(0, 40) + "...";
  }
  return text;
}

function ImageCard(props) {
  const { imageUrl, title } = props;

  // Ensure imageUrl uses https
  const secureImageUrl = imageUrl
    ? imageUrl.replace(/^http:\/\//i, "https://")
    : undefined;

  return (
    <img
      src={secureImageUrl}
      alt={title}
      style={{
        objectFit: "contain",
        paddingTop: "16px",
        width: "102px",
        // height: "154px",
        color: "#fafafa",
        borderRadius: "3px",
        border: "solid 1px #999",
        height: "min-content",
        padding: 0,
      }}
    />
  );
}
