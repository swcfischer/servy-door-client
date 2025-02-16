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
    position: relative;

    label {
      width: 150px;
    }

    .tooltip-icon {
      margin-left: 10px;
    }

    .error-message {
      position: absolute;
      top: 32px;
      right: 0;
      color: red;
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
      <h1>Accounts</h1>
      <ul style={{ padding: 0, margin: "0 0 24px 0", listStyle: "none" }}>
        <li>
          <strong>User UUID:</strong> {user.uuid}
        </li>
      </ul>

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
              <Field
                type="text"
                name="accountName"
                className="form-field"
                placeholder="Example, Steve"
              />

              <Tooltip title="No spaces and must be at least two characters">
                <span className="tooltip-icon">ⓘ</span>
              </Tooltip>
              <ErrorMessage
                name="accountName"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <strong>Password:</strong>
              </label>
              <Field type="password" name="password" className="form-field" />

              <Tooltip title="Must be at least 4 characters">
                <span className="tooltip-icon">ⓘ</span>
              </Tooltip>

              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <strong>Confirm Password:</strong>
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-field"
              />

              <Tooltip title="Passwords must match">
                <span className="tooltip-icon">ⓘ</span>
              </Tooltip>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="secret">
                <strong>Secret:</strong>
              </label>
              <Field
                type="text"
                name="secret"
                className="form-field"
                title="The secret is used to reset your password"
                placeholder="Example, Camp David"
              />

              <Tooltip title="Must be at least 8 characters and is used to do a password reset.">
                <span className="tooltip-icon">ⓘ</span>
              </Tooltip>
              <ErrorMessage
                name="secret"
                component="div"
                className="error-message"
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <LoginToAnotherAccount />
    </Container>
  );
}

export default Accounts;
