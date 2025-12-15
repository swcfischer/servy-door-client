import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link } from "gatsby";
import React, { useEffect, useState } from "react";

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
            title={volumeInfo.title || undefined}
          />
          <CardContent sx={{ paddingTop: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontStyle: "italic",
                lineHeight: 1.2,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
              className="hover-underline"
              title={volumeInfo.title || undefined}
            >
              {volumeInfo.title}
            </Typography>
            <br />
            <Typography
              variant="body2"
              color="textSecondary"
              className="hover-underline"
              title={volumeInfo.authors?.join(", ") || undefined}
            >
              {volumeInfo.authors?.map((author, idx) => (
                <span key={`${author}-${idx}`} style={{ display: "block" }}>
                  {author}
                  {idx < (volumeInfo.authors?.length ?? 0) - 1 ? "," : ""}
                </span>
              ))}
            </Typography>
            ---
            <Typography
              variant="body2"
              color="textSecondary"
              className="hover-underline"
              title={
                isOver(volumeInfo.publisher, 40)
                  ? volumeInfo.publisher
                  : undefined
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

// Removed ellipsis truncation to show full titles

function ImageCard(props) {
  const { imageUrl, title } = props;
  const [isBroken, setIsBroken] = useState(false);

  if (!imageUrl || isBroken) {
    return (
      <div
        style={{
          minWidth: "100px",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#c6c6c6",
          fontWeight: "bold",
          fontStyle: "italic",
          fontSize: "12px",
          borderRadius: "3px",
          border: "solid 1px #999",
        }}
      >
        Broken Image
      </div>
    );
  }

  return (
    <CardMedia
      component="img"
      image={imageUrl}
      alt={title}
      loading="lazy"
      decoding="async"
      onError={() => setIsBroken(true)}
      sx={{
        objectFit: "contain",
        pt: 2,
        width: "136px",
        // height: "150px",
        color: "#fafafa",
        borderRadius: "3px",
        border: "solid 1px #999",
        height: "min-content",
        padding: 0,
      }}
    />
  );
}
