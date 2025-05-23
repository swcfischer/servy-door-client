import React from "react";

const links = [
  {
    name: "Small UI Fixes for Reading Application",
    url: "https://www.youtube.com/watch?v=4X25XEoErHA&ab_channel=StevenFischer",
  },
  {
    name: "GitHub Copilot Versus Jr. Dev. ",
    url: "https://www.youtube.com/watch?v=vjOFLjSa8dU&t=3s",
  },
  {
    name: "ServyDoor",
    url: "https://www.youtube.com/watch?v=vjOFLjSa8dU&t=3s",
  },
  {
    name: "Avid Language Learning",
    url: "https://www.avidlanguagelearning.com/",
  },

  // {
  //   name: "Language Learning Application",
  //   url: "https://avidlanguagelearning.com",
  // },
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
          listStyleType: "none",
        }}
      >
        {links.map((link, index) => (
          <li
            key={index}
            style={{
              marginBottom: "10px",
              color: "#052b54",
              display: "flex",
              alignItems: "center",
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
            {link.children && link.children.length > 0 && (
              <ul
                style={{
                  marginTop: "10px",
                  marginLeft: "20px",
                  listStyleType: "circle",
                }}
              >
                {link.children.map((child, childIndex) => (
                  <li key={childIndex} style={{ marginBottom: "5px" }}>
                    <a
                      href={child.url}
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
                      {child.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <ol>
        <li
          style={{
            margin: 0,
            padding: 0,
            marginBottom: "10px",
            color: "#052b54",
            display: "flex",
            alignItems: "center",
          }}
        >
          <a
            style={{
              textDecoration: "none",
              color: "#000000",
              transition: "color 0.3s",
              fontSize: 24,
              fontWeight: "bold",
            }}
            href="https://www.youtube.com/@FishTalkFish"
          >
            YouTube Channel
          </a>
        </li>
      </ol>
    </div>
  );
};

export default Steve;

// {
//   name: "Portfolio",
//   url: "https://stevefischer.dev",
//   children: [
//     {
//       name: "Avid Language Learning (ALL)",
//       url: "https://avidlanguagelearning.com",
//     },
//     {
//       name: "Tech Blog",
//       url: "https://stevefischer.surge.sh",
//     },
//     {
//       name: "Asia Teach (TEFL in Asia)",
//       url: "https://asia-teach.com",
//     },
//     {
//       name: "Box Office",
//       url: "https://www.stevefischer.dev/box-office",
//     },
//   ],
// },
