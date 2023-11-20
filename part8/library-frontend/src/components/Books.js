import { useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries";
import { useState, useEffect } from "react";
import BookTable from "./BookTable";

const Books = () => {
  const [genreFilter, setGenreFilter] = useState(null);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const allBooksQuery = useQuery(ALL_BOOKS);
  const queryByGenre = useQuery(BOOKS_BY_GENRE);

  useEffect(() => {
    if (allBooksQuery.data && !allBooksQuery.loading && !genreFilter) {
      setBooks(allBooksQuery.data.allBooks);
      // Get a list of all genres for filter buttons
      let tempGenres = [];
      for (let index = 0; index < books.length; index++) {
        const book = books[index];
        tempGenres.push(...book.genres);
      }

      setGenres([...new Set(tempGenres)]); // Only unique values
    }
  }, [allBooksQuery.data, books, allBooksQuery.loading, genreFilter]);

  if (allBooksQuery.loading) {
    return <div>loading...</div>;
  }

  const fetchByGenre = async (newGenre) => {
    if (!newGenre) {
      await allBooksQuery.refetch();
      return setBooks(allBooksQuery.data.allBooks);
    }

    setGenreFilter(newGenre);
    const filteredBooks = await queryByGenre.refetch({ genre: newGenre });
    setBooks(filteredBooks.data.allBooks);
  };

  return (
    <div>
      <h2>books</h2>
      {genreFilter && (
        <p>
          in genre <b>{genreFilter}</b>
        </p>
      )}
      <BookTable books={books} />
      {genres.map((g) => (
        <button key={`genre-${g}`} onClick={() => fetchByGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => fetchByGenre(null)}>all genres</button>
    </div>
  );
};

export default Books;
