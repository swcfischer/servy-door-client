import React, { useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";

function Book(props) {
  console.log("🚀 ~ Book ~ props:", props);
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  useEffect(() => {
    async function fetchBook() {
      // const response = await axios.get()
    }
    if (id) {
    }
  }, [id]);

  return (
    <Layout>
      <h1>Book</h1>
    </Layout>
  );
}

export default Book;
