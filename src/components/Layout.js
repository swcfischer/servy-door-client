import React, { createContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import TiltedTile from "./TiltedTile";
import GoogleAuthButton from "./GoogleAuthButton";
import axiosInstance from "../axiosInstance";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import HelmetComponent from "./HelmetComponent";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

// import CssBaseline from "@mui/material/CssBaseline";
// import githubLogo from "../images/github-copilot-white-icon.png";

const StyledContainer = styled(Container)`
  background: #fafafa;
  background: #f9e699ff;
  background: ${(props) => {
    switch (props.brightnessLevel) {
      case 1:
        return "#ffe066"; // Bright yellow
      case 2:
        return "#ffcd00"; // Medium yellow (original)
      case 3:
        return "#e6b800"; // Darker yellow
      default:
        return "#ffcd00";
    }
  }};
  padding-top: 1px;
  border-radius: 3px;
  // # Border
  border: 4px solid rgb(28, 28, 28);
  border-top: none;
  box-shadow: 0 4px 8px rgb(18, 18, 18);
  transition: background 0.3s ease;

  .app-bar {
    background-color: rgb(33, 33, 33);
    border-radius: 8px;
    margin-top: 12px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: flex;
    justify-content: space-between;
    width: 210px;
    align-items: center;
  }

  .auth-button-container {
    display: flex;
    align-items: center;
  }

  .footer {
    margin-top: auto;
    padding: 3rem 0;
    text-align: center;
    color: #d4c066;
    background-color: #111;
    border-radius: 3px;
    box-shadow: var(--Paper-shadow);
    position: relative;

    p {
      font-size: 34px;
    }

    #attribution {
      position: absolute;
      right: 10px;
      bottom: 10px;
      font-family: Tangerine;
      font-size: 18px;
      opacity: 0.3;
      text-decoration: none;
      color: #d4c066;
    }
  }

  .typography {
    color: #d4c066;
    backdrop-filter: blur(28px);
    padding: 12px;
    width: max-content;
    font-size: 22px;
    font-family: Tangerine;
    margin: 0 auto;
    border-radius: 3px;
    border: 1px solid #d4c066;
  }

  .footer-links {
    width: 125px;
    text-align: left;
    margin: 30px auto;
    padding: 0;

    list-style: none;

    li {
      padding: 0 0 8px 8px;
      a {
        text-decoration: none;
        color: #d4c066;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

// New: Wrapper to manage hover area and positioning
const BrightnessWrapper = styled("div")`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 56px; /* hover area */
  height: 56px; /* hover area */
  border-radius: 50%;
  /* Reveal the button when hovering the area */
  &:hover .brightness-toggle {
    opacity: 1 !important;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }
`;

const BrightnessToggle = styled(Fab)`
  /* Position handled by the wrapper */
  position: static !important;
  width: 56px;
  height: 56px;
  background-color: #2c2c2c !important;
  color: #ffcd00 !important;
  font-weight: bold !important;
  box-shadow: none !important;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease !important;

  &.is-hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateY(8px) scale(0.98);
  }

  &:hover {
    background-color: #1a1a1a !important;
    box-shadow: none !important;
  }
`;

const initialState = {};

export const StateContext = createContext(initialState);
export const UserContext = createContext({});

const Layout = ({ children }) => {
  const [state, _setState] = useState({});
  const [user, setUser] = useState({ isLoading: true });
  const [brightnessLevel, setBrightnessLevel] = useState(2); // Default to middle level
  // New: state to control auto-hide
  const [isBrightnessHidden, setIsBrightnessHidden] = useState(false);

  const setState = (newState) => {
    _setState({ ...state, ...newState });
  };

  // Load brightness preference from localStorage on mount
  useEffect(() => {
    const savedBrightness = localStorage.getItem("brightness-level");
    if (savedBrightness) {
      setBrightnessLevel(parseInt(savedBrightness));
    }
  }, []);

  // Cycle through brightness levels (1 -> 2 -> 3 -> 1)
  const cycleBrightness = () => {
    const nextLevel = brightnessLevel >= 3 ? 1 : brightnessLevel + 1;
    setBrightnessLevel(nextLevel);
    localStorage.setItem("brightness-level", nextLevel.toString());
  };

  // New: hide the brightness toggle after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setIsBrightnessHidden(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // fetch user if there is a jwt in local storage
    const token = localStorage.getItem("token");

    function registerAnon() {
      axiosInstance.post("/users/register-anon").then((res) => {
        const { token, uuid } = res.data;
        localStorage.setItem("token", token);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;
        setUser({
          name: "",
          email: "",
          uuid,
          status: "anonymous",
          isLoading: false,
        });
      });
    }

    try {
      if (!token) {
        registerAnon();
      } else {
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;
        axiosInstance.get("/users/current_user").then((res) => {
          if (!res?.data?.currentUser) {
            return registerAnon();
          }
          setUser({
            ...res?.data?.currentUser,
            isLoading: false,
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user, setUser }}>
          <StateContext.Provider value={{ state, setState }}>
            <StyledContainer maxWidth="sm" brightnessLevel={brightnessLevel}>
              <AppBar className="app-bar" position="static">
                <Toolbar className="toolbar">
                  <div>
                    <TiltedTile text="ServyDoor" to="/" />
                  </div>
                  {/* <div>
                    <TiltedTile text="_ ??? _" to="/road-map" />
                  </div> */}
                  <div className="nav-links">
                    <TiltedTile text="Library" to="/library" />
                    <div className="auth-button-container">
                      <GoogleAuthButton />
                    </div>
                  </div>
                </Toolbar>
              </AppBar>
              <HelmetComponent />

              <div style={{ minHeight: "150vh" }}>{children}</div>
              {/* <footer className="footer">
                <Typography variant="body2" className="typography">
                  ServyDoor{" "}
                </Typography>
                <ul className="footer-links">
                  <li>
                    <a href="https://github.com/swcfischer">About Creator</a>
                  </li>
                  <li>
                    <Link to="/tos">Terms of Service</Link>
                  </li>
                  <li>
                    <Link to="/about">About Application</Link>
                  </li>
                  <li>
                    <Link to="/account">Account</Link>
                  </li>
                  <li>
                    <Link to="/library">Library</Link>
                  </li>
                </ul>
              </footer> */}
            </StyledContainer>

            {/* Wrapped toggle: reappears on hover */}
            <BrightnessWrapper>
              <BrightnessToggle
                className={`brightness-toggle ${
                  isBrightnessHidden ? "is-hidden" : ""
                }`}
                onClick={cycleBrightness}
                size="medium"
                aria-label="cycle brightness levels"
              >
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {brightnessLevel}
                </span>
              </BrightnessToggle>
            </BrightnessWrapper>
          </StateContext.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
};

export default Layout;
