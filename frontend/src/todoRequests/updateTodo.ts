import { EDIT_TODO, EditTodoVariables } from "@/lib/graphql";

export async function updateTodo({
    id,
    title,
    description,
    completed,
    token,
}: EditTodoVariables) {
    const response = await fetch(`http://localhost:8000/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `${token}` : "",
        },
        body: JSON.stringify({
            query: EDIT_TODO,
            variables: {
                id,
                title,
                description,
                completed,
                token,
            },
        }),
    });

    if (!response.ok) {
        throw new Error("error to update todo fetch err");
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error("Error in grapql");
    }

    return result.data;
}
