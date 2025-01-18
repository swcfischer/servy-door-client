import { Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";
import { useLocation } from "@reach/router";
import styled from "@emotion/styled";

const StyledLink = styled(Link)`
  outline: none;

  .tile {
    background-color: #222;
    border: 1px solid #fff;
    border-radius: 3px;
    color: #fff;
    font-family: Tangerine;
    padding: 2px 3px;
    position: relative;
    transform: rotate(18deg);
    font-size: 26px;
  }

  .span {
    display: inline-block;
    transform: rotate(-17deg);
  }

  .home {
    position: absolute;
    bottom: -13px;
    right: 0px;
    font-size: 20px;
    font-weight: 100;
    font-family: serif;
    color: rgba(250, 255, 103, 0.41);
  }
`;

function TiltedTile(props) {
  const { text, to } = props;

  const pathname = useLocation().pathname;

  const shouldShow = to === "/" ? pathname === "/" : pathname.includes(to);

  return (
    <StyledLink to={to}>
      <Typography variant="h6" className="tile">
        <span className="span">{text}</span>
        {shouldShow && <span className="home">*</span>}
      </Typography>
    </StyledLink>
  );
}

export default TiltedTile;
