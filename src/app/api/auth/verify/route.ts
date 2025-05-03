import {connect} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/User"



connect()



export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {token} = reqBody 


        const user = await User.findOne({
            verificationToken:token,
            verificationTokenExpires:{$gt:Date.now()}
        })

        if(!user){
            return NextResponse.json({
                error:"Invalid token"
            },
            {
                status:400
            })
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined
        await user.save()

        return NextResponse.json({
            message:"Email verified successfully",
            success:true
        })

    } catch (error:unknown) {
        return NextResponse.json({
            error:"Something went wrong"
        },
        {
            status:500
        }
    )}
}