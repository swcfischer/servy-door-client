import React, { useState } from "react";
import { css } from "@emotion/react";
import { useEffect } from "react";
import Markdown from "react-markdown";

import axiosInstance from "../../axiosInstance";

const Container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Entry = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axiosInstance.get("/library/entry");
        // console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const md = `
    - Item 1
    - Item 2
    - Item 3

    **Bold Text**

    *Italic Text*
    `;

  if (isLoading) {
    return <div>Is Loading</div>;
  }
  return (
    <div css={Container}>
      <h1>Library Entry</h1>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <Markdown>{md}</Markdown>
      </div>
    </div>
  );
};

export default Entry;
