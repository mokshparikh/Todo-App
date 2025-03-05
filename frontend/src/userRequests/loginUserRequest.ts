import { LOGIN_USER } from "@/lib/graphql";

interface LoginVariables {
    email: string;
    password: string;
}

export const loginUserRequest = async ({
    email,
    password,
}: LoginVariables): Promise<string> => {
    const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: LOGIN_USER,
            variables: {
                email,
                password,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0]?.message || "GraphQL errors occurred");
    }

    return result.data.login;
};
