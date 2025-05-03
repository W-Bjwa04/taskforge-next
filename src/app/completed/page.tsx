// pages/completed.tsx (or a similar path based on your file structure)
"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function CompletedTasks() {
  const router = useRouter()

  const [user, setUser]: any = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

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
      const completedTodos = response.data.data.filter(todo => todo.status === 'Completed') // Only completed tasks
      setTodos(completedTodos)
    } catch {
      toast.error("Failed to load todos")
    } finally {
      setLoading(false)
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
          <p className="font-semibold">{user?.email || "Guest"}</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Completed Tasks</h1>
        </header>

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
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500">
                    {todo.status}
                  </span>
                </div>
              ))}
            </section>
          ) : (
            <p className="text-center py-10 text-gray-400">No completed tasks yet!</p>
          )
        )}
      </main>
    </div>
  )
}
