import React, { useState } from "react";
import { css } from "@emotion/react";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

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
  if (isLoading) {
    return (
      <div style={{ margin: "0 auto" }}>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div css={Container}>
      <h1>Library Entry</h1>
      <div style={{ maxWidth: 500, margin: "0 auto" }}></div>
    </div>
  );
};

export default Entry;
