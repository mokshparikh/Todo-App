import {
    REGISTER_USER,
    RegisterUserResponse,
    RegisterUserVariables,
} from "@/lib/graphql";

export async function registerUserReq({
    username,
    email,
    password
}: RegisterUserVariables): Promise<RegisterUserResponse> {
    const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: REGISTER_USER,
            variables: {
                username,
                email,
                password,
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

    console.log("register", result.data);

    return result.data;
}
