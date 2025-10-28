import React, { useContext } from "react";
import { UserContext } from "../components/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Tooltip } from "@mui/material";
import styled from "@emotion/styled";
import LoginToAnotherAccount from "../components/LoginToAnotherAccount";
import axiosInstance from "../axiosInstance";

const Container = styled.div`
  .form-group {
    display: flex;
    margin-bottom: 32px;

    label {
      width: 150px;
    }

    .tooltip-icon {
      margin-left: 10px;
    }

    .form-field-container {
      position: relative;

      .error-message {
        position: absolute;
        top: 32px;
        left: 0;
        color: red;
        width: max-content;
      }
    }
  }

  button {
    height: max-content;
    padding: 11px 20px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    margin-top: 12px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #555;
    }
  }
`;

function Accounts(props) {
  const { user } = useContext(UserContext);

  // Check if user is logged in with Google OAuth
  const isGoogleUser = user?.googleId;

  const initialValues = {
    accountName: "",
    password: "",
    secret: "",
  };

  const validationSchema = Yup.object({
    accountName: Yup.string()
      .matches(/^\S*$/, "No spaces allowed")
      .required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    secret: Yup.string().required("Required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    axiosInstance
      .post("/users/set-password-secret-account", {
        ...values,
        token: window.localStorage.getItem("token"),
      })
      .then((response) => {
        console.log("Success:", response.data);
        // Handle success, e.g., show a success message or redirect
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error, e.g., show an error message
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container>
      <h1>Account</h1>

      {isGoogleUser ? (
        // Google OAuth User Section
        <div>
          <h2>Google Account</h2>
          <div
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #5e5e5e",
              marginBottom: "24px",
            }}
          >
            {user.avatar && (
              <div style={{ marginBottom: "16px" }}>
                <img
                  src={user.avatar}
                  alt="Profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "1px solid #181818",
                  }}
                />
              </div>
            )}
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              <li style={{ marginBottom: "12px" }}>
                <strong>Name:</strong> {user.accountName || "Not set"}
              </li>
              <li style={{ marginBottom: "12px" }}>
                <strong>Email:</strong> {user.email || "Not provided"}
              </li>
              <li style={{ marginBottom: "12px" }}>
                <strong>Status:</strong> {user.status}
              </li>
              <li style={{ marginBottom: "12px" }}>
                <strong>Google ID:</strong> {user.googleId}
              </li>
              <li style={{ marginBottom: "12px" }}>
                <strong>User UUID:</strong> {user.uuid}
              </li>
            </ul>
          </div>

          <p>
            You are logged in with Google. Your account is automatically managed
            through Google OAuth.
          </p>
          <p>
            With Google authentication, you get enhanced features including
            better Google Books API access and higher rate limits.
          </p>
        </div>
      ) : (
        // Traditional Account Section
        <div>
          <p>
            The intention is to not collect your email. Instead you set a
            username, password and secret.
          </p>
          <p>
            The secret is used to unlock your account. We recommend writing it
            down. The account name is what shows up when you write a review or
            share insight (coming soon).
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="account-form">
                <h2>Set Account Name, Password and Secret</h2>
                <div className="form-group">
                  <label htmlFor="accountName">
                    <strong>Account Name:</strong>
                  </label>
                  <div className="form-field-container">
                    <Field
                      type="text"
                      name="accountName"
                      className="form-field"
                      placeholder="Example, Steve"
                    />

                    <ErrorMessage
                      name="accountName"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <Tooltip title="No spaces and must be at least two characters">
                    <span className="tooltip-icon">ⓘ</span>
                  </Tooltip>
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <strong>Password:</strong>
                  </label>
                  <div className="form-field-container">
                    <Field
                      type="password"
                      name="password"
                      className="form-field"
                    />

                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <Tooltip title="Must be at least 4 characters">
                    <span className="tooltip-icon">ⓘ</span>
                  </Tooltip>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <strong>Confirm Password:</strong>
                  </label>
                  <div className="form-field-container">
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-field"
                    />

                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <Tooltip title="Passwords must match">
                    <span className="tooltip-icon">ⓘ</span>
                  </Tooltip>
                </div>
                <div className="form-group">
                  <label htmlFor="secret">
                    <strong>Secret:</strong>
                  </label>

                  <div className="form-field-container">
                    <Field
                      type="text"
                      name="secret"
                      className="form-field"
                      title="The secret is used to reset your password"
                      placeholder="Example, Camp David"
                    />

                    <ErrorMessage
                      name="secret"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <Tooltip title="Must be at least 8 characters and is used to do a password reset.">
                    <span className="tooltip-icon">ⓘ</span>
                  </Tooltip>
                </div>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
          <LoginToAnotherAccount />
          <ul style={{ padding: 0, margin: "0 0 24px 0", listStyle: "none" }}>
            <li>
              <strong>User UUID:</strong> {user.uuid}
            </li>
          </ul>
        </div>
      )}
    </Container>
  );
}

export default Accounts;
