import React from "react";

const links = [
  {
    name: "Junior Dev. Versus Github CoPilot",
    url: "https://www.youtube.com/watch?v=vjOFLjSa8dU",
  },
  { name: "YouTube Channel", url: "https://www.youtube.com/@FishTalkFish" },
  { name: "GitHub", url: "https://github.com/swcfischer" },
];

const Steve = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#333" }}>Steve's Links</h2>
      <ol
        style={{
          lineHeight: "1.8",
          fontSize: "18px",
          color: "#555",
          listStyleType: "decimal",
        }}
      >
        {links.map((link, index) => (
          <li
            key={index}
            style={{
              marginBottom: "10px",
              color: "#052b54", // Makes the bullet point numbers blue
            }}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "#007BFF",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#0056b3")}
              onMouseOut={(e) => (e.target.style.color = "#007BFF")}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Steve;
