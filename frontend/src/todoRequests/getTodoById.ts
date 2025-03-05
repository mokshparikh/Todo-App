import { GET_TODO_BY_ID } from "@/lib/graphql";

export async function getTodoById({
    id,
    token,
}: {
    id: number;
    token?: string;
}) {
    try {
        const response = await fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authentication: token ? `${token}` : "",
            },
            body: JSON.stringify({
                query: GET_TODO_BY_ID,
                variables: { id },
            }),
        });

        if (!response.ok) {
            throw new Error("Error fetching details from API");
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error("Error in GraphQL query");
        }

        console.log("result", result.data.data);

        return result.data;
    } catch (error) {
        console.log("Error sending request to get todos", error);
        return undefined;
    }
}
