"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            Cookies.remove("token");
            toast.success("You have successfully logged out!");
            router.push("/login");
        } catch (e) {
            console.error("Logout error:", e);
            toast.error("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
            >
                Logout
            </button>
        </>
    );
};

export default LogoutButton;
