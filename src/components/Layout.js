import React, { createContext, useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TiltedTile from "./TiltedTile";

const containerStyles = {
  background: "#fafafa",
  paddingTop: "24px",
  borderRadius: "3px",
};

const appBarStyles = {
  backgroundColor: "rgb(54 54 54)",
  borderRadius: "8px",
  marginTop: "18px",
};

const toolbarStyles = {
  display: "flex",
  justifyContent: "space-between",
};

const navLinksStyles = {
  display: "flex",
  justifyContent: "space-between",
  width: "300px",
};

const footerStyles = {
  marginTop: "auto",
  padding: "1rem 0",
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#111",
  borderRadius: "3px",
  boxShadow: "var(--Paper-shadow)",
};

const typographyStyles = {
  color: "#fff",
  backdropFilter: "blur(28px)",
  padding: "12px",
  width: "max-content",
  fontSize: "22px",
  fontFamily: "cursive",
  margin: "0 auto",
  borderRadius: "3px",
  border: "1px solid #fff",
};

const initialState = {};

export const StateContext = createContext(initialState);

const Layout = ({ children }) => {
  const [state, _setState] = useState({});

  const setState = (newState) => {
    _setState({ ...state, ...newState });
  };

  return (
    <StateContext.Provider value={{ state, setState }}>
      <Container maxWidth="md" sx={containerStyles}>
        <AppBar position="static" style={appBarStyles}>
          <Toolbar sx={toolbarStyles}>
            <div>
              <TiltedTile text="ServyDoor" to="/" />
            </div>
            <div style={navLinksStyles}>
              <TiltedTile text="Social" to="/social" />
              <TiltedTile text="Library" to="/library" />
              <TiltedTile text="Account" to="/account" />
            </div>
          </Toolbar>
        </AppBar>

        <div style={{ minHeight: "150vh" }}>{children}</div>
        <footer style={footerStyles}>
          <Typography variant="body2" style={typographyStyles}>
            Read Write Send
          </Typography>
        </footer>
      </Container>
    </StateContext.Provider>
  );
};

export default Layout;
