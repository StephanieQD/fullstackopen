import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ME, BOOKS_BY_GENRE } from "../queries";
import BookTable from "./BookTable";

const Recommendations = () => {
  const [faveGenre, setFaveGenre] = useState(null);
  const [books, setBooks] = useState([]);
  const userResult = useQuery(ME);
  const bookResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: faveGenre },
    skip: !faveGenre,
  });

  useEffect(() => {
    if (userResult.data) {
      const currentUser = userResult.data.me;
      setFaveGenre(currentUser.favoriteGenre);
      console.log(currentUser);
    }
  }, [userResult]);

  useEffect(() => {
    if (bookResult.data) {
      setBooks(bookResult.data.allBooks);
    }
  }, [bookResult]);

  if (userResult.loading || bookResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre <b>{faveGenre}</b>
      </p>
      <BookTable books={books} />
    </div>
  );
};

export default Recommendations;
