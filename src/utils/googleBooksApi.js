import axios from "axios";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

export const searchBooks = async ({ author, subject, title }) => {
  try {
    let query = "";
    if (author) query += `inauthor:${author}`;
    if (subject) query += `${query ? "+" : ""}insubject:${subject}`;
    if (title) query += `${query ? "+" : ""}intitle:${title}`;

    const response = await axios.get(GOOGLE_BOOKS_API_URL, {
      params: {
        q: query,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
