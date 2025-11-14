import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import axiosInstance from "../axiosInstance";
import { UserContext } from "./Layout";

const Container = styled.div`
  label {
    font-weight: bold;
  }
`;

function LoginToAnotherAccount(props) {
  const { user, setUser } = useContext(UserContext);

  const initialValues = {
    accountName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    accountName: Yup.string().required("Account Name is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    axiosInstance
      .post("/users/login", values)
      .then((response) => {
        const { token } = response.data;
        window.localStorage.setItem("token", token);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        setUser({ ...user, ...response.data.user });
        // Handle successful login here (e.g., redirect, store token, etc.)
      })
      .catch((error) => {
        console.error("Login error", error);
        // Handle login error here (e.g., show error message)
      });

    setSubmitting(false);
  };

  return (
    <Container>
      <h2>Login to Another Account</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="accountName">Account Name</label>

              <div className="form-field-container">
                <Field
                  type="text"
                  name="accountName"
                  className="form-control"
                />
                <ErrorMessage
                  name="accountName"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="form-field-container">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default LoginToAnotherAccount;
