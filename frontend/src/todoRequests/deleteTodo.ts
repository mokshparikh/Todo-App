import { DELETE_TODO, DeleteTodoResponse } from "@/lib/graphql";

export async function deleteTodo({
    id,
    token,
}: {
    id: number;
    token: string;
}): Promise<DeleteTodoResponse> {
    try {
        const response = await fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
                query: DELETE_TODO,
                variables: {
                    id: id,
                    token: token,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Error deleting todo: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.data && result.data.deleteTodo !== undefined) {
            return {
                deleteTodo: result.data.deleteTodo,
            };
        }

        throw new Error("Unexpected response structure");
    } catch (error) {
        console.error("Error in deleteTodo:", error);
        throw error;
    }
}
