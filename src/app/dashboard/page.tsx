"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AddTodoForm from "./AddTodoForm"
import UpdateTodoForm from "./UpdateTodoForm" // ✅ Import Update Form

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser]: any = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null) // ✅ Track which todo is being edited

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/auth/me")
      setUser(response.data.user)
    } catch {
      router.push("/login")
    }
  }

  const getTodos = async () => {
    if (!user?._id) return
    setLoading(true)
    try {
      const response = await axios.get(`/api/todos?userId=${user._id}`)
      setTodos(response.data.data)
    } catch {
      toast.error("Failed to load todos")
    } finally {
      setLoading(false)
    }
  }

  const onTodoAdded = () => {
    getTodos()
    setShowForm(false)
  }

  const onTodoUpdated = () => {
    getTodos()
    setEditingTodo(null)
  }

  const handleDeleteTodo = async (todoId: string) => {
    if (!user?._id || !todoId) return

    try {
      const confirmDelete = confirm("Are you sure you want to delete this task?")
      if (!confirmDelete) return

      const response = await axios.delete(`/api/todos/q?id=${todoId}&userid=${user._id}`)
      toast.success("Todo deleted successfully")
      getTodos()
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to delete todo")
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (user?._id) {
      getTodos()
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 p-6 border-r border-gray-800 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">TaskForge</h2>
          <nav className="space-y-4">
            <Link href="/dashboard" className="block text-gray-300 hover:text-white">Dashboard</Link>
            <Link href="/completed" className="block text-gray-300 hover:text-white">Completed</Link>
            <Link href="/settings" className="block text-gray-300 hover:text-white">Settings</Link>
          </nav>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold">
            {user?.email || "Guest"}
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </header>

        {/* Add Todo Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <AddTodoForm 
              userId={user?._id} 
              onClose={() => setShowForm(false)} 
              onTodoAdded={onTodoAdded} 
            />
          </div>
        )}

        {/* Update Todo Form Modal */}
        {editingTodo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <UpdateTodoForm
              todo={editingTodo}
              onClose={() => setEditingTodo(null)}
              onTodoUpdated={onTodoUpdated}
            />
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          todos.length ? (
            <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {todos.map(todo => (
                <div key={todo._id} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105 relative">
                  <h2 className="text-xl font-bold mb-2">{todo.title}</h2>
                  <p className="text-sm text-gray-400 mb-2">Due: {new Date(todo.deadline).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-300 mb-4">{todo.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${todo.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {todo.status}
                  </span>

                  <button 
                    onClick={() => setEditingTodo(todo)}
                    className="absolute top-2 right-20 text-sm bg-blue-700 px-2 py-1 rounded hover:bg-blue-800"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="absolute top-2 right-3 text-sm bg-red-700 px-2 py-1 rounded hover:bg-red-800"
                  >
                    Delete
                  </button>

                </div>
              ))}
            </section>
          ) : (
            <p className="text-center py-10 text-gray-400">No TODOs available. Create your first task!</p>
          )
        )}
      </main>
    </div>
  )
}
