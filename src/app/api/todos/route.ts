import {connect} from "@/dbConfig/dbConfig"
import Todo from "@/models/Todo"
import mongoose from "mongoose"
import User from "@/models/User"
import {NextResponse, NextRequest} from "next/server"


connect()


// add an todo

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { title, description, status, deadline, userId } = reqBody;

        console.log(reqBody)

        if (!title || !description || !status || !deadline || !userId) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (!mongoose.isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: "Email not verified" }, { status: 403 });
        }

        if (isNaN(Date.parse(deadline))) {
            return NextResponse.json({ error: "Invalid deadline format" }, { status: 400 });
        }

        const todoExists = await Todo.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            userId
        });

        if (todoExists) {
            return NextResponse.json({ error: "Todo already exists" }, { status: 409 });
        }

        const todo = new Todo({
            title,
            description,
            status,
            deadline,
            userId
        });

        const savedTodo = await todo.save();

        return NextResponse.json({
            message: "Todo posted successfully",
            data: savedTodo
        }, { status: 201 });

    } catch (error: any) {
        console.error("Todo POST error:", error);
        return NextResponse.json({ error: "Todo cannot be posted" }, { status: 500 });
    }
}


// get all todo 

export async function GET(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");
  
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      if (!user.isVerified) {
        return NextResponse.json({ error: "Email not verified" }, { status: 403 });
      }
  
      const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
  
      return NextResponse.json({
        message: "Todos fetched successfully",
        data: todos,
      });
    } catch (error) {
      return NextResponse.json({ error: "Cannot Find Todo" }, { status: 500 });
    }
  }
