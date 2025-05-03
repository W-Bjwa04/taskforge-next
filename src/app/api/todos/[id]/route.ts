import { connect } from "@/dbConfig/dbConfig"
import Todo from "@/models/Todo"
import mongoose from "mongoose"
import User from "@/models/User"
import { NextResponse, NextRequest } from "next/server"

connect()

// Update a todo
export async function PUT(request: NextRequest) {
    try {
        const todoId = request.nextUrl.searchParams.get("id")
        const userId = request.nextUrl.searchParams.get("userid")
        const reqBody = await request.json()

        console.log(reqBody)
        console.log(userId)

        const { title, description, status, deadline} = reqBody

        // validate request body
        if (!title || !description || !status || !deadline || !userId) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        if (!mongoose.isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
        }
        
        // validate the todo id
        if (!mongoose.isValidObjectId(todoId)) {
            return NextResponse.json({ error: "Invalid todo id" }, { status: 400 })
        }

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: "Email not verified" }, { status: 403 })
        }

        if (isNaN(Date.parse(deadline))) {
            return NextResponse.json({ error: "Invalid deadline format" }, { status: 400 })
        }

        const todo = await Todo.findById(todoId)
        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 })
        }

        if (todo.userId.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        todo.title = title
        todo.description = description
        todo.status = status
        todo.deadline = deadline

        await todo.save()

        return NextResponse.json({
            message: "Todo updated successfully",
            success: true,
        }, { status: 201 })

    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Failed to update todo" },
            { status: 500 }
        )
    }
}


// delete a todo 

export async function DELETE(request:NextRequest){
    try {
        const todoId = request.nextUrl.searchParams.get("id")
        const userId = request.nextUrl.searchParams.get("userid")
        if (!mongoose.isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
        }
        
        // validate the todo id
        if (!mongoose.isValidObjectId(todoId)) {
            return NextResponse.json({ error: "Invalid todo id" }, { status: 400 })
        }

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: "Email not verified" }, { status: 403 })
        }

        const todo = await Todo.findById(todoId)
        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 })
        }

        if (todo.userId.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await todo.deleteOne()

        return NextResponse.json({
            message: "Todo deleted successfully",
            success: true,
        }, { status: 201 })

    } catch (error:unknown) {
        return NextResponse.json(
            {
                error: "Failed to delete todo"
            },
            {
                status: 500
            }
        )
    }
}