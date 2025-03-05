
export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export interface GetUserTodosResponse {
    data: {
        getUserTodos: Todo[];
    };
}

import { GET_USER_TODOS } from "@/lib/graphql";

export async function getTodo({ token }: { token: string | undefined }) {
    try {
        const response = await fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authentication: token ? `${token}` : "",
            },
            body: JSON.stringify({
                query: GET_USER_TODOS,
                variables: {
                    userId: token,
                },
            }),
        });

        if (!response.ok) {
            const errorMessage = `Error fetching todos: ${response.status} - ${response.statusText}`;
            console.log(errorMessage);
            return undefined;
        }

        const data: GetUserTodosResponse = await response.json();

        return data?.data?.getUserTodos;
    } catch (error) {
        console.log("Error sending request to get todos", error);
        return undefined;
    }
}
