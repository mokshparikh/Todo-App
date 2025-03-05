"use client";

import { RegisterUserResponse, RegisterUserVariables } from "@/lib/graphql";
import { registerUserReq } from "@/userRequests/registerUserReq";
import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export async function getServerSideProps() {
    const queryClient = new QueryClient();
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const router = useRouter();

    const { mutate: registerUser, status } = useMutation
    <
        RegisterUserResponse,
        Error,
        RegisterUserVariables
    >
    ({
        mutationFn: registerUserReq,
        onSuccess: () => {
            router.push("/login");
            toast.success("Registration successful!");
        },
        onError: (err) => {
            console.error("Error during registration:", err);
            toast.error("Registration failed. Please try again.");
        },
    });

    const handleRegister = (e: FormEvent): void => {
        e.preventDefault();
        registerUser({ email, password, username });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md p-8 bg-gray-800 text-white rounded-xl shadow-lg space-y-6 transform transition-all hover:scale-105"
            >
                <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
                <p className="text-center text-gray-400">Create your account</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-lg font-medium text-gray-300">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={status === "pending"}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {status === "pending" ? "Registering..." : "Register"}
                </button>
                
                <div className="text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-400 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
            <ToastContainer position="top-right" autoClose={2000} newestOnTop />
        </div>
    );
};

export default RegisterForm;
