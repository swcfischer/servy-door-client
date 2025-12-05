import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import { getImageLink } from "../utils/image";

const cardStyles = {
  display: "flex",
  boxShadow: "none",
  background: "transparent",
};

function BestselllerItem(props) {
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
          <ImageCard volumeInfo={volumeInfo} title={volumeInfo.title} />

          <CardContent sx={{ paddingTop: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontStyle: "italic",
                lineHeight: 1.2,
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
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
              sx={{ fontSize: "1.15rem" }}
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
              sx={{ fontSize: "1.1rem" }}
              // title={volumeInfo.publisher}
            >
              {volumeInfo.publisher}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="hover-underline"
              sx={{ fontSize: "1.1rem" }}
            >
              {formatDate(volumeInfo.publishedDate)}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default BestselllerItem;

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
  const { volumeInfo, title } = props;
  const [bestImg, setBestImg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function pickBest() {
      try {
        const result = await getImageLink(volumeInfo?.imageLinks);
        if (isMounted) setBestImg(result);
      } catch (e) {
        if (isMounted) setBestImg(null);
      }
    }
    pickBest();
    return () => {
      isMounted = false;
    };
  }, [volumeInfo?.imageLinks]);

  const src = bestImg?.image
    ? bestImg.image.replace(/^http:\/\//i, "https://")
    : undefined;

  if (!src) {
    return (
      <div
        style={{
          minWidth: "200px",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#c6c6c6",
          fontWeight: "bold",
          fontStyle: "italic",
          fontSize: "16px",
          borderRadius: "3px",
          border: "solid 1px #999",
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      style={{
        objectFit: "contain",
        paddingTop: "16px",
        width: "200px",
        height: "min-content",
        display: "block",
        borderRadius: "3px",
        border: "1px solid #999",
        padding: 0,
      }}
    />
  );
}
