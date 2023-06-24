const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const resolvers = {
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    author: async (root) => Author.findOne({ _id: root.author }),
    genres: (root) => root.genres,
    id: (root) => root.id,
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    id: (root) => root.id,
    bookCount: async (root) => root.books.length,
  },
  Query: {
    allBooks: async (root, args) => {
      let author;

      if (args.author) author = await Author.findOne({ name: args.author });

      return Book.find({
        ...(args.author && { author: author }),
        ...(args.genre && { genres: args.genre }),
      });
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {
      const all = await Author.find({}).populate("books");
      console.log(all);
      return all;
    },
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", { extensions: { code: "BAD_USER_INPUT" } });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: { code: "BAD_USER_INPUT", invalidArgs: args.author, error },
          });
        }
      }

      const book = new Book({ ...args, author });

      try {
        await author.updateOne({ $push: { books: book } });
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args.title, error },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", { extensions: { code: "BAD_USER_INPUT" } });
      }

      return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true });
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });
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

      if (!user || args.password !== "secret") {
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

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
