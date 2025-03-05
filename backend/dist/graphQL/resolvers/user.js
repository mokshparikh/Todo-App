"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const userResolvers = {
    Query: {},
    Mutation: {
        register: async (_, { email, password, username }) => {
            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    throw new Error("User already exists with this email");
                }
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                const user = await prisma.user.create({
                    data: {
                        email,
                        username,
                        password: hashedPassword,
                    },
                });
                return user;
            }
            catch (error) {
                throw new Error("Error registering user: " + error.message);
            }
        },
        login: async (_, { email, password }) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user)
                    throw new Error("User not found");
                const validPassword = await bcryptjs_1.default.compare(password, user.password);
                if (!validPassword)
                    throw new Error("Invalid password");
                if (!process.env.JWT_SECRET) {
                    throw new Error("JWT_SECRET is not defined in environment variables");
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                });
                return token;
            }
            catch (error) {
                throw new Error("Error logging in: " + error.message);
            }
        },
    },
};
exports.userResolvers = userResolvers;
