import React, { useState } from "react";
import { useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../components/Layout";
import { Link } from "gatsby";

function Library() {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/books/user-books/" + user.uuid
        );
        setBooks(response.data);
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {books.map((bk) => {
          return (
            <div
              key={bk.uuid}
              style={{ flex: "1 0 21%", boxSizing: "border-box" }}
            >
              <h2 style={{ fontSize: "16px" }}>{bk.title}</h2>
              <p style={{ fontSize: "14px" }}>{bk.author}</p>
              <img
                src={bk.image}
                alt={bk.title}
                style={{ width: "80px", height: "auto" }}
              />
              <Link
                to={`/book/${bk.uuid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <button style={{ marginTop: "10px" }}>View Details</button>
              </Link>
            </div>
          );
        })}
      </div>
      <ul>
        <li>Reading</li>
        <li>Bookmarked</li>
      </ul>
    </div>
  );
}

export default Library;
