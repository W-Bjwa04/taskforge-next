"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { X } from "lucide-react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

type Todo = {
  _id: string
  title: string
  description: string
  status: string
  deadline: string
  userId: string
}

export default function UpdateTodoForm({
  todo,
  onClose,
  onTodoUpdated,
}: {
  todo: Todo
  onClose: () => void
  onTodoUpdated: () => void
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    deadline: "",
  })

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description,
        status: todo.status,
        deadline: todo.deadline,
      })
    }
  }, [todo])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString().split("T")[0]
      setFormData({ ...formData, deadline: isoDate })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Send userId as a query parameter
      await axios.put(`/api/todos/q?id=${todo._id}&userid=${todo.userId}`, formData)
      toast.success("Todo updated successfully")
      onTodoUpdated()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update todo")
    }
  }

  return (
    <div className="relative bg-gray-800 p-6 rounded-lg shadow-2xl max-w-xl w-full z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-white text-center">Update Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Deadline</label>
          <ReactDatePicker
            selected={formData.deadline ? new Date(formData.deadline) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select a date"
          />
        </div>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Update Todo
        </button>
      </form>
    </div>
  )
}
