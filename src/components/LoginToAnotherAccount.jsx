import React from "react";
import { UserContext } from "../components/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Tooltip } from "@mui/material";
import styled from "@emotion/styled";

const Container = styled.div``;

function LoginToAnotherAccount(props) {
  const initialValues = {
    accountName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    accountName: Yup.string().required("Account Name is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Login data", values);
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
              <Field type="text" name="accountName" className="form-control" />
              <ErrorMessage
                name="accountName"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
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
