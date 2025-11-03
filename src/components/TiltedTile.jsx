import { Typography } from "@mui/material";
import { Link } from "gatsby";
import React from "react";
import { useLocation } from "@reach/router";
import styled from "@emotion/styled";
import { CSSTransition } from "react-transition-group";

const StyledLink = styled(Link)`
  outline: none !important;
  border: 1px solid transparent;
  transition: border-color 0.7s ease-in-out;
  display: block;
  margin: 20px 0;
  user-select: none;
  -webkit-user-drag: none !important;

  &:focus {
    border: 1px solid #dadada;
  }

  .tile {
    background-color: #222;
    border: 1px solid #5e5e5e;
    border-radius: 3px;
    color: #d4c066;
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
    color: #d4c066;
  }
`;

const duration = 400;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

function TiltedTile(props) {
  const { text, to } = props;

  const pathname = useLocation().pathname;

  const shouldShow = to === "/" ? pathname === "/" : pathname.includes(to);

  return (
    <StyledLink to={to}>
      <Typography variant="h6" className="tile">
        <span className="span">{text}</span>
        {/* {shouldShow && <span className="home">*</span>} */}

        <CSSTransition in={shouldShow} timeout={duration}>
          {(state) => (
            <span
              className="home"
              style={{ ...defaultStyle, ...transitionStyles[state] }}
            >
              *
            </span>
          )}
        </CSSTransition>
      </Typography>
    </StyledLink>
  );
}

export default TiltedTile;

export function TitltedAnchorTag(props) {
  const { text, to } = props;

  return (
    <StyledAnchor href={to}>
      <Typography variant="h6" className="tile">
        <span className="span">{text}</span>
      </Typography>
    </StyledAnchor>
  );
}

const StyledAnchor = styled.a`
  outline: none !important;
  border: 1px solid transparent;
  transition: border-color 0.7s ease-in-out;
  display: block;
  margin: 20px 0;
  user-select: none;
  -webkit-user-drag: none !important;

  &:focus {
    border: 1px solid #dadada;
  }

  .tile {
    background-color: #222;
    border: 1px solid #5e5e5e;
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
    color: #d4c066;
  }
`;
