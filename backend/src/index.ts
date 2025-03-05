import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { todoResolvers } from "./graphQL/resolvers/todo";
import { userResolvers } from "./graphQL/resolvers/user";
import { typeDefs } from "./graphQL/type";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 8001;

app.use(cookieParser());

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

const resolvers = {
  Query: {
    ...todoResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...todoResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};

const verifyToken = (authorizationHeader: string): MyJwtPayload | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    return decodedToken as MyJwtPayload;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
        console.error("Token has expired");
      } else {
        console.error("Invalid or expired token");
      }
    } else {
      console.error("Unknown error occurred during token verification");
    }
    return null;
  }
};

// Apollo Server Setup
const server = new ApolloServer({
  typeDefs,
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
  app.use(cors(corsOptions));

  await server.start();

  server.applyMiddleware({ app } as any);

  // Start the Express server
  app.listen(port, () =>
    console.log(
      `Server is running on http://localhost:${port}${server.graphqlPath}`
    )
  );
};

serverStart().catch((err) => {
  console.log(`Server error: ${err}`);
});
