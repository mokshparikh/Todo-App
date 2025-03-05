"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type User {
    id: Int!
    username: String!
    email: String!
    imageUrl: String
    password: String
    createdAt: String!
    updatedAt: String!

    todos: [Todo!]!
  }

  type Todo {
    id: Int!
    title: String!
    description: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
    userId: Int!
    user: User!
  }

  type Query {
    getTodo: [Todo!]!
    getTodoById(id: Int!): Todo
    getUserTodos(userId: String!): [Todo!]!
  }

  type Mutation {
    addTodo(
      token: String!
      title: String!
      description: String!
      completed: Boolean
    ): Todo!

    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!

    deleteTodo(id: Int!, token: String!): Boolean!

    editTodo(
      id: Int!
      token: String!
      title: String
      description: String
      completed: Boolean
    ): Todo!
  }
`;
exports.typeDefs = typeDefs;
