"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoResolvers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const todoResolvers = {
    Query: {
        getTodo: async () => {
            try {
                return await prisma.todo.findMany();
            }
            catch (error) {
                throw new Error("Error fetching todos: " + error.message);
            }
        },
        getUserTodos: async (_, { userId }) => {
            const userJwt = jsonwebtoken_1.default.verify(userId, process.env.JWT_SECRET);
            return prisma.todo.findMany({
                where: {
                    userId: Number(userJwt.userId),
                },
            });
        },
        getTodoById: async (_, { id }) => {
            try {
                const todo = await prisma.todo.findUnique({
                    where: { id: parseInt(id, 10) },
                });
                if (!todo) {
                    throw new Error("Todo not found");
                }
                return todo;
            }
            catch (error) {
                throw new Error("Error fetching todo by ID: " + error.message);
            }
        },
    },
    Mutation: {
        addTodo: async (_, { title, description, token, completed, }) => {
            const userJwt = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            try {
                // Check if the user exists
                const user = await prisma.user.findUnique({
                    where: { id: Number(userJwt.userId) },
                });
                if (!user) {
                    throw new Error("User not found");
                }
                // Create the new Todo
                const newTodo = await prisma.todo.create({
                    data: {
                        title,
                        description,
                        completed: completed ?? false,
                        userId: user.id,
                    },
                });
                return newTodo;
            }
            catch (error) {
                throw new Error("Error adding Todo: " + error.message);
            }
        },
        deleteTodo: async (_, { id, token }) => {
            try {
                const todo = await prisma.todo.findUnique({
                    where: { id: parseInt(id, 10) },
                });
                if (!todo) {
                    throw new Error("Todo not found");
                }
                // Delete the todo
                await prisma.todo.delete({
                    where: { id: parseInt(id, 10) },
                });
                return true;
            }
            catch (error) {
                throw new Error("Error deleting Todo: " + error.message);
            }
        },
        editTodo: async (_, { id, title, description, completed, }) => {
            try {
                const todo = await prisma.todo.findUnique({
                    where: { id: parseInt(id, 10) },
                });
                if (!todo) {
                    throw new Error("Todo not found");
                }
                const updatedTodo = await prisma.todo.update({
                    where: { id: parseInt(id, 10) },
                    data: {
                        title: title ?? todo.title,
                        description: description ?? todo.description,
                        completed: completed ?? todo.completed,
                    },
                });
                return updatedTodo;
            }
            catch (error) {
                throw new Error("Error editing Todo: " + error.message);
            }
        },
    },
};
exports.todoResolvers = todoResolvers;
