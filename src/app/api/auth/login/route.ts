import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/User"
import { NextRequest,NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"


connect()


export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()
        const {email,password} = reqBody

        console.log(reqBody)
        //validate 
        if(!email || !password){
            return NextResponse.json({error:"All fields are required"},{status:400})
        }

        //check if user already exists 
        const user = await User.findOne({email:reqBody.email})

        if(!user){
            return NextResponse.json({error:"User does not exist"},{status:400})
        }

     
        //check if password is correct 
        const validPassword = await bcryptjs.compare(reqBody.password,user.password)

        if(!validPassword){
            return NextResponse.json({error:"Invalid password"},{status:400})
        }

        // Check if email is verified
        if (!user.isVerified) {
            return NextResponse.json({error:"Account is not verified"},{status:400})
        }
        //create token data 
        const tokenData = {
            id:user._id,
            email:user.email
        }

        //create token 
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"})

        const response = NextResponse.json({
            message:"Login successful",
            success:true
        })

        // set the token in the cookies 

        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response 

    } catch (error:unknown) {
        return NextResponse.json({
            error:"Someting went wrong"
        },{
            status:500
        })
    }
}