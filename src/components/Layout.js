import React, { createContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TiltedTile from "./TiltedTile";
import axiosInstance from "../axiosInstance";
import styled from "@emotion/styled";

const StyledContainer = styled(Container)`
  background: #fafafa;
  padding-top: 1px;
  border-radius: 3px;

  .app-bar {
    background-color: rgb(54, 54, 54);
    border-radius: 8px;
    margin-top: 12px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
  }

  .nav-links {
    display: flex;
    justify-content: space-between;
    width: 210px;
  }

  .footer {
    margin-top: auto;
    padding: 1rem 0;
    text-align: center;
    color: #fff;
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
      color: #fff;
    }
  }

  .typography {
    color: #fff;
    backdrop-filter: blur(28px);
    padding: 12px;
    width: max-content;
    font-size: 22px;
    font-family: Tangerine;
    margin: 0 auto;
    border-radius: 3px;
    border: 1px solid #fff;
  }
`;

const initialState = {};

export const StateContext = createContext(initialState);
export const UserContext = createContext({});

const Layout = ({ children }) => {
  const [state, _setState] = useState({});
  const [user, setUser] = useState({ isLoading: true });

  const setState = (newState) => {
    _setState({ ...state, ...newState });
  };

  useEffect(() => {
    // fetch user if there is a jwt in local storage
    const token = localStorage.getItem("token");

    function registerAnon() {
      axiosInstance.post("/users/register-anon").then((res) => {
        const { token, uuid } = res.data;
        localStorage.setItem("token", token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
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
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
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
    <UserContext.Provider value={{ user, setUser }}>
      <StateContext.Provider value={{ state, setState }}>
        <StyledContainer maxWidth="sm">
          <AppBar className="app-bar" position="static">
            <Toolbar className="toolbar">
              <div>
                <TiltedTile text="ServyDoor" to="/" />
              </div>
              <div className="nav-links">
                {/* <TiltedTile text="Social" to="/social" /> */}
                <TiltedTile text="Library" to="/library" />
                <TiltedTile text="Account" to="/account" />
              </div>
            </Toolbar>
          </AppBar>

          <div style={{ minHeight: "150vh" }}>{children}</div>
          <footer className="footer">
            <Typography variant="body2" className="typography">
              ServyDoor{" "}
            </Typography>
            <a
              target="_blank"
              href="https://github.com/swcfischer"
              id="attribution"
            >
              Steve Fischer
            </a>
          </footer>
        </StyledContainer>
      </StateContext.Provider>
    </UserContext.Provider>
  );
};

export default Layout;
