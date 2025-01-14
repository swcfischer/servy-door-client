import { Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";
import { useLocation } from "@reach/router";

const tileStyle = {
  backgroundColor: "#222",
  border: "1px solid #fff",
  borderRadius: "3px",
  color: "#fff",
  fontFamily: "cursive, sans-serif",
  padding: "8px",
  position: "relative",
  transform: "rotate(18deg)",
};

const spanStyle = {
  display: "inline-block",
  transform: "rotate(-17deg)",
};

const homeStyles = {
  position: "absolute",
  bottom: "-12px",
  right: "-1px",
  fontSize: "22px",
  fontFamily: "monospace",
  fontWeight: "100",
  color: "rgba(250, 255, 103, 0.41)",
};

function TiltedTile(props) {
  const { text, to } = props;

  const pathname = useLocation().pathname;

  const shouldShow = to === "/" ? pathname === "/" : pathname.includes(to);

  return (
    <Link style={{ outline: "none" }} to={to}>
      <Typography variant="h6" style={tileStyle}>
        <span style={spanStyle}>{text}</span>
        {shouldShow && <span style={homeStyles}>*</span>}
      </Typography>
    </Link>
  );
}

export default TiltedTile;
