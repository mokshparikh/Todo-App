import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

interface UserJwt {
    userId: string;
}

const todoResolvers = {
    Query: {
        getTodo: async (): Promise<any[]> => {
            try {
                return await prisma.todo.findMany();
            } catch (error: any) {
                throw new Error("Error fetching todos: " + error.message);
            }
        },

        getUserTodos: async (
            _: any,
            { userId }: { userId: string }
        ): Promise<any[]> => {
            const userJwt = jwt.verify(userId, process.env.JWT_SECRET!) as UserJwt;

            return prisma.todo.findMany({
                where: {
                    userId: Number(userJwt.userId),
                },
            });
        },

        getTodoById: async (_: any, { id }: { id: string }): Promise<any> => {
            try {
                const todo = await prisma.todo.findUnique({
                    where: { id: parseInt(id, 10) },
                });

                if (!todo) {
                    throw new Error("Todo not found");
                }

                return todo;
            } catch (error: any) {
                throw new Error("Error fetching todo by ID: " + error.message);
            }
        },
    },

    Mutation: {
        addTodo: async (
            _: any,
            {
                title,
                description,
                token,
                completed,
            }: {
                title: string;
                description: string;
                token: string;
                completed?: boolean;
            }
        ): Promise<any> => {
            const userJwt = jwt.verify(token, process.env.JWT_SECRET!) as UserJwt;

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
            } catch (error: any) {
                throw new Error("Error adding Todo: " + error.message);
            }
        },

        deleteTodo: async (
            _: any,
            { id, token }: { id: string; token: string }
        ): Promise<boolean> => {
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
            } catch (error: any) {
                throw new Error("Error deleting Todo: " + error.message);
            }
        },

        editTodo: async (
            _: any,
            {
                id,
                title,
                description,
                completed,
            }: {
                id: string;
                token: string;
                title?: string;
                description?: string;
                completed?: boolean;
            }
        ): Promise<any> => {
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
            } catch (error: any) {
                throw new Error("Error editing Todo: " + error.message);
            }
        },
    },
};

export { todoResolvers };
