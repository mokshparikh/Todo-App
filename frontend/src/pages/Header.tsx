"use client";
import React from "react";
import LogoutButton from "./LogoutButton";

const Header = () => {
    return (
        <div className="flex justify-between items-center px-10 py-4 bg-gray-900 shadow-md">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500">
                Todo List
            </h1>
            <LogoutButton />
        </div>
    );
};

export default Header;
