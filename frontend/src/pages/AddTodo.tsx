"use client";

import React, { FormEvent, useEffect, useState } from "react";
import TodoList from "./TodoList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodo } from "@/todoRequests/getTodo";
import { createTodo } from "@/todoRequests/createTodo";
import { deleteTodo } from "@/todoRequests/deleteTodo";
import { completeTodo } from "@/todoRequests/completeTask";
import Cookies from "js-cookie";
import Header from "./Header";

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;

}

const AddTodo: React.FC = () => {
    const queryClient=useQueryClient()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [userTodos, setUserTodos] = useState<Todo[]>([]);

    const sessionid = Cookies.get("token");

    const { data, isLoading, error } = useQuery({
        queryKey: ["getUserTodos"],
        queryFn: () => getTodo({ token: sessionid as string }),
        enabled: !!sessionid,
    });

    useEffect(() => {
        if (data) setUserTodos(data as Todo[]);
    }, [data]);

    const { mutate: addTodo } = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUserTodos"] });
            toast.success("Todo added successfully!");
            setTitle("");
            setDescription("");
        },
        onError: (error) => toast.error(`Error adding todo: ${error.message || "Unknown error"}`),
    });

    const { mutate: deleteTodoById } = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUserTodos"] });
            toast.success("Todo deleted successfully!");
        },
        onError: (error) => toast.error(`Error deleting todo: ${error.message || "Unknown error"}`),
    });

    const { mutate: toggleComplete } = useMutation({
        mutationFn: completeTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUserTodos"] });
            toast.success("Todo updated successfully!");
        },
        onError: (error) => toast.error(`Error updating todo: ${error.message || "Unknown error"}`),
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!sessionid) return toast.error("No session token found.");
        addTodo({ title, description, token: sessionid, completed: false });
    };

    const handleDelete = (id: number) => {
        if (sessionid) deleteTodoById({ id, token: sessionid });
    };

    const handleToggleCompleted = (id: number, completed: boolean) => {
        if (sessionid) toggleComplete({ id, token: sessionid, completed });
    };

    return (
        <>
            <Header />
            <ToastContainer position="top-right" autoClose={2000} newestOnTop />
            <div className="min-h-screen flex flex-col items-center bg-[#1E1E1E] py-10">
                {/* Todo Form */}
                <div className="w-full max-w-lg bg-[#252525] p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-white">Add a New Todo</h2>
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-[#333] text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            placeholder="Enter title"
                        />
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-2 bg-[#333] text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            placeholder="Enter description"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all"
                        >
                            Add Todo
                        </button>
                    </form>
                </div>

                {/* Todo List */}
                <div className="w-full max-w-4xl mt-10 bg-[#252525] p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-white mb-4">Your Todos</h3>
                    {isLoading ? (
                        <div className="text-white text-center">Loading todos...</div>
                    ) : error ? (
                        <div className="text-red-400 text-center">Error loading todos</div>
                    ) : (
                        <TodoList userTodos={userTodos} onDelete={handleDelete} onToggleCompleted={handleToggleCompleted} />
                    )}
                </div>
            </div>
        </>
    );
};

export default AddTodo;
