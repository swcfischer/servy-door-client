import React from "react";

function GoogleBook(props) {
  const { title, author, label = "Here" } = props;

  if (!title && !author) {
    return null;
  }

  const searchUrl = generateSearchUrl({ title, author });

  return (
    <>
      <dt>Recent News</dt>
      <dd>
        <a href={searchUrl} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </dd>
    </>
  );
}

export function generateSearchUrl({ title = "", author = "" }) {
  const query = `${title} ${author}`;
  return `https://news.google.com/search?q=${encodeURIComponent(query)}`;
}

export default GoogleBook;
