const { GraphQLError } = require("graphql");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;
const PASSWORD = process.env.PASSWORD;

console.log("connecting to", MONGODB_URI);

const useMongo = true;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context
 * of the book instead of the author's name.
 * However, for simplicity, we will store the author's name in connection with the book
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook (
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ) : Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: () => {
      if (useMongo) {
        return Book.collection.countDocuments();
      } else {
        return books.length;
      }
    },
    authorCount: () => {
      if (useMongo) {
        return Author.collection.countDocuments();
      } else {
        return authors.length;
      }
    },
    allBooks: async (root, args) => {
      if (useMongo) {
        console.log("Attempting to get books...");
        let query = {};
        if (args.genre) {
          console.log("Attempting to fetch by genre...", args.genre);
          query.genres = args.genre;
        }

        if (args.author) {
          console.log("Attempting to fetch by author...", args.author);
          const author = await Author.findOne({ name: args.author });
          console.log("Author is ", author);
          if (!author) {
            return [];
          }
          query.author = author._id;
        }

        return await Book.find(query).populate("author");
      } else {
        let filteredBooks = books;
        if (args.author) {
          filteredBooks = filteredBooks.filter(
            (book) => book.author === args.author
          );
        }
        if (args.genre) {
          filteredBooks = filteredBooks.filter((book) =>
            book.genres.includes(args.genre)
          );
        }
        return filteredBooks;
      }
    },
    allAuthors: async () => {
      if (useMongo) {
        return await Author.find({});
      } else {
        return authors;
      }
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== PASSWORD) {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
    addBook: async (root, args, context) => {
      if (useMongo) {
        console.log("attempting to save book", args);
        let author = await Author.findOne({ name: args.author });
        const currentUser = context.currentUser;

        if (!currentUser) {
          throw new GraphQLError("not authenticated", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }
        if (!author) {
          author = new Author({ name: args.author, born: null });

          try {
            await author.save();
          } catch (error) {
            throw new GraphQLError("Saving author failed", {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.author,
                error,
              },
            });
          }
        }
        const book = new Book({
          author,
          title: args.title,
          published: args.published,
          genres: args.genres,
        });
        try {
          await book.save();
        } catch (error) {
          throw new GraphQLError("Saving book failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error,
            },
          });
        }

        return book;
      } else {
        const book = { ...args, id: uuid() };
        books = books.concat(book);
        // See if author exists
        const searchAuthor = authors.find(
          (author) => author.name === book.author
        );
        if (!searchAuthor) {
          const author = {
            name: book.author,
            id: uuid(),
          };
          authors = authors.concat(author);
        }
        return book;
      }
    },
    editAuthor: async (root, args, context) => {
      if (useMongo) {
        const query = { name: args.name };
        const author = await Author.findOne(query);
        const currentUser = context.currentUser;

        if (!currentUser) {
          throw new GraphQLError("not authenticated", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }
        console.log("updating author", args);
        if (!author) {
          return null;
        }

        try {
          await Author.updateOne(query, {
            $set: {
              born: args.setBornTo,
            },
          });
          return await Author.findOne(query);
        } catch (e) {
          console.log("something went wrong", e);
        }
      } else {
        const searchAuthor = authors.find(
          (author) => author.name === args.name
        );
        if (!searchAuthor) {
          return null;
        }
        const updatedAuthor = { ...searchAuthor, born: args.setBornTo };
        authors = authors.map((a) =>
          a.name === args.name ? updatedAuthor : a
        );
        return updatedAuthor;
      }
    },
  },
  Author: {
    bookCount: async (root) => {
      if (useMongo) {
        console.log("finding book count", root);
        const foundBooks = await Book.find({
          author: root._id,
        });
        console.log("and these are the books", foundBooks);
        return foundBooks.length;
      } else {
        const foundBooks = books.filter((book) => book.author === root.name);
        return foundBooks.length;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
