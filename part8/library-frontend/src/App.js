import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <div>
          <Link style={{ margin: 5 }} to="/">
            authors
          </Link>
          <Link style={{ margin: 5 }} to="/books">
            books
          </Link>
          <Link style={{ margin: 5 }} to="addbook">
            add book
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/addbook" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
