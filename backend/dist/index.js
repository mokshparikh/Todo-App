"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const todo_1 = require("./graphQL/resolvers/todo");
const user_1 = require("./graphQL/resolvers/user");
const type_1 = require("./graphQL/type");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cookie_parser_1.default)());
const resolvers = {
    Query: {
        ...todo_1.todoResolvers.Query,
        ...user_1.userResolvers.Query,
    },
    Mutation: {
        ...todo_1.todoResolvers.Mutation,
        ...user_1.userResolvers.Mutation,
    },
};
const verifyToken = (authorizationHeader) => {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authorizationHeader.replace("Bearer ", "");
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    }
    catch (err) {
        if (err instanceof Error) {
            if (err.name === "TokenExpiredError") {
                console.error("Token has expired");
            }
            else {
                console.error("Invalid or expired token");
            }
        }
        else {
            console.error("Unknown error occurred during token verification");
        }
        return null;
    }
};
// Apollo Server Setup
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: type_1.typeDefs,
    resolvers,
    context: async ({ req }) => {
        const sessionToken = req?.headers?.authorization;
        let user = null;
        if (sessionToken) {
            const decodedToken = verifyToken(sessionToken);
            if (decodedToken) {
                user = { id: decodedToken.userId };
            }
        }
        return {
            prisma,
            user,
        };
    },
});
const serverStart = async () => {
    const corsOptions = {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
    };
    app.use((0, cors_1.default)(corsOptions));
    await server.start();
    server.applyMiddleware({ app });
    // Start the Express server
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}${server.graphqlPath}`));
};
serverStart().catch((err) => {
    console.log(`Server error: ${err}`);
});
