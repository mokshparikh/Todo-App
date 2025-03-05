import { EDIT_TODO, EditTodoVariables } from "@/lib/graphql";

export async function completeTodo({
    id,
    completed,
    token,
}: EditTodoVariables) {
    try {
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
                    completed,
                    token,
                },
            }),
        });

        const data = await response.json();
        console.log("data", data);
    } catch (error) {
        console.log("Error to fetch request for complete todo", error);
    }
}
