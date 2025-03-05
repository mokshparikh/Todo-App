"use client";

import { QueryClient,dehydrate } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { loginUserRequest } from "@/userRequests/loginUserRequest";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export async function getServerSideProps() {
    const queryClient = new QueryClient();

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: loginUser } = useMutation({
        mutationFn: loginUserRequest,
        onSuccess: (token: string) => {
            const isSecure = window.location.protocol === "https:";
            Cookies.set("token", token, { expires: 7, secure: isSecure });
            toast.success("Login successful!");
            router.push("/");
        },
        onError: (error: Error) => {
            toast.error("Login failed! Please check your credentials.");
            console.error("Error during login:", error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginUser({ email, password });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl space-y-6 transform transition-all hover:scale-105"
            >
                <h2 className="text-4xl font-extrabold text-center text-white">Welcome Back!</h2>
                <p className="text-center text-gray-400">Login to your account</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-lg font-semibold text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-semibold text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Sign In
                </button>
                
                <div className="text-center">
                    <p className="text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-blue-400 font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;