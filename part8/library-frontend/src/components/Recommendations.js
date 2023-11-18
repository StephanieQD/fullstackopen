import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS } from "../queries";
import BookTable from "./BookTable";

const Recommendations = () => {
  const userResult = useQuery(ME);
  const bookResult = useQuery(ALL_BOOKS);

  if (userResult.loading || bookResult.loading) {
    return <div>loading...</div>;
  }

  const currentUser = userResult.data.me;
  const books = bookResult.data.allBooks;
  const filteredBooks = books.filter((book) =>
    book.genres.includes(currentUser.favoriteGenre)
  );

  console.log(currentUser);

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre <b>{currentUser.favoriteGenre}</b>
      </p>
      <BookTable books={filteredBooks} />
    </div>
  );
};

export default Recommendations;
