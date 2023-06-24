import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query allBooks($genre: String, $author: String) {
    allBooks(author: $author, genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(title: $title, published: $published, author: $author, genres: $genres) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const UPDATE_YEAR = gql`
  mutation setYear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CURRENT_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    genres
    author {
      name
      born
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;
