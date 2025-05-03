"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from  "next/link"

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the current user
  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/auth/me")
      setUser(response.data.user)
    } catch (error) {
      toast.error("Failed to fetch user data.")
      router.push("/login") // Redirect to login if user is not authenticated
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout") 
      router.push("/login") // Redirect to login page after logout
    } catch (error) {
      toast.error("Failed to log out.")
    }
  }

  // Fetch user data when the component is mounted
  useEffect(() => {
    getCurrentUser()
  }, [])

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
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </header>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">User Information</h2>
              <p className="text-sm text-gray-400 mb-2">Email: {user?.email}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
