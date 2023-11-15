import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

const App = () => {
  const [token, setToken] = useState(null);

  // if (!token) {
  //   return (
  //     <div>
  //       <h2>Login</h2>
  //       <LoginForm setToken={setToken} />
  //     </div>
  //   );
  // }

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
