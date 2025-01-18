import React, { useState } from "react";
import { useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";

function Library() {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/books/user-books/" + user.uuid
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user.uuid) {
      fetchData();
    }
  }, [user]);
  return (
    <div>
      <h1>Library</h1>
      <ul>
        <li>Reading</li>
        <li>Bookmarked</li>
      </ul>
    </div>
  );
}

export default Library;
