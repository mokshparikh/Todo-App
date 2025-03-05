"use client";
import { useRouter } from "next/navigation";
import { MdOutlineDeleteForever } from "react-icons/md";

const TodoList = ({
  userTodos,
  onDelete,
  onToggleCompleted,
}: {
  userTodos: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }[];
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number, completed: boolean) => void;
}) => {
  const router = useRouter();

  const handleViewClick = (todo: { id: number; title: string; description: string }) => {
    router.push(`/todos/${todo.id}`);
  };

  return (
    <div className="overflow-x-auto bg-[#1E1E1E] p-6 rounded-lg shadow-md text-white">
      <table className="min-w-full table-auto border-collapse border border-gray-700">
        <thead>
          <tr className="bg-[#333] text-white">
            <th className="px-4 py-3 text-left border border-gray-700">ID</th>
            <th className="px-4 py-3 text-left border border-gray-700">Title</th>
            <th className="px-4 py-3 text-left border border-gray-700">Status</th>
            <th className="px-4 py-3 text-left border border-gray-700">Actions</th>
            <th className="px-4 py-3 text-left border border-gray-700">View</th>
            <th className="px-4 py-3 text-left border border-gray-700">Complete</th>
          </tr>
        </thead>
        <tbody>
          {userTodos?.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
                🚀 No tasks available! Add a new todo.
              </td>
            </tr>
          ) : (
            userTodos?.map((todo, index) => (
              <tr key={todo.id} className="border-b border-gray-700">
                <td className="px-4 py-3 border border-gray-700">{index + 1}</td>
                <td className="px-4 py-3 border border-gray-700 font-semibold">{todo.title}</td>
                <td className="px-4 py-3 border border-gray-700">
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${todo.completed
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                      }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-700">
                  <button
                    className="p-2 hover:text-red-400 transition duration-200"
                    onClick={() => onDelete(todo.id)}
                  >
                    <MdOutlineDeleteForever size={24} />
                  </button>
                </td>
                <td className="px-4 py-3 border border-gray-700">
                  <button
                    onClick={() => handleViewClick(todo)}
                    className="text-blue-400 hover:text-blue-600 transition duration-200"
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-3 border border-gray-700 text-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => onToggleCompleted(todo.id, e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
