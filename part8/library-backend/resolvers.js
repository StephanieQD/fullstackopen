const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const PASSWORD = process.env.PASSWORD;

const useMongo = true;

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
          author = new Author({ name: args.author, born: null, bookCount: 1 });

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
        } else {
          author.bookCount += 1;
          await author.save();
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
        pubsub.publish("BOOK_ADDED", { bookAdded: book });
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

        let updatedProps = {
          born: args.setBornTo,
        };

        // TEMP - Fix book count for previously added authors (pre save implementation)
        if (author.bookCount === 0) {
          const foundBooks = await Book.find({
            author: author._id,
          });

          updatedProps.bookCount = foundBooks.length;
        }

        try {
          await Author.updateOne(query, {
            $set: updatedProps,
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
