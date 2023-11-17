import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = () => {
  const [genreFilter, setGenreFilter] = useState(null);
  const result = useQuery(ALL_BOOKS);
  if (result.loading) {
    return <div>loading...</div>;
  }
  const books = result.data.allBooks;
  let genres = [];

  // Get a list of all genres for filter buttons
  for (let index = 0; index < books.length; index++) {
    const book = books[index];
    genres.push(...book.genres);
  }
  genres = [...new Set(genres)]; // Only unique values

  return (
    <div>
      <h2>books</h2>
      {genreFilter && (
        <p>
          in genre <b>{genreFilter}</b>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) =>
              genreFilter ? book.genres.includes(genreFilter) : book
            )
            .map((book) => {
              return (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={`genre-${g}`} onClick={() => setGenreFilter(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenreFilter(null)}>all genres</button>
    </div>
  );
};

export default Books;
