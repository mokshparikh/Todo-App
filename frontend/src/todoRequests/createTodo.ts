import { addTodoMut } from "@/lib/graphql";

interface CreateTodo {
    title: string;
    description: string;
    token: string;
    completed: boolean;
}

export interface CreateTodoResponse {
    title: string;
    description: string;
    completed: boolean;
}

export async function createTodo({
    title,
    description,
    token,
    completed,
}: CreateTodo): Promise<CreateTodoResponse> {


    // Ensure token is present in the Authorization header
    const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
        },
        body: JSON.stringify({
            query: addTodoMut,
            variables: {
                title,
                description,
                completed,
                token
            },
        }),
    });

    if (!response.ok) {
        const errorMessage = `Error creating todo: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const result = await response.json();

    // Improved error handling: Check if data is available in the result
    if (result.errors) {
        throw new Error(
            `API Error: ${result.errors[0]?.message || "Unknown error"}`
        );
    }

    if (!result.data) {
        throw new Error("API response does not contain data");
    }

    return result.data as CreateTodoResponse;
}
