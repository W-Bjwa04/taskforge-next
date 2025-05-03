import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/User"
import {NextResponse, NextRequest} from "next/server"
import bcryptjs from "bcryptjs"
import { sendMail } from "@/helpers/sendmail"
connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        console.log(reqBody)

        // validations 

        if(!email || !password){
            return NextResponse.json({error:"Please provide email and password"}, {status: 400})
        }

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error:"User already exists"}, {status: 400})
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = new User({
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        // send the verification email 
        await sendMail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })


    } catch (error:any) {
        return NextResponse.json({error:"Signup Failed"}, {status: 500})
    }
}

