import React from "react";

function GoogleBook(props) {
  const { title, author, icon: Component } = props;

  if (!title && !author) {
    return null;
  }

  const searchUrl = generateSearchUrl({ title, author });

  return (
    <>
      <a href={searchUrl} target="_blank" rel="noopener noreferrer">
        <Component />
      </a>
    </>
  );
}

export function generateSearchUrl({ title = "", author = "" }) {
  const query = `${title} ${author}`;
  return `https://news.google.com/search?q=${encodeURIComponent(query)}`;
}

export default GoogleBook;
