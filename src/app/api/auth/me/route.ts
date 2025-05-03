import {connect} from "@/dbConfig/dbConfig"
import { getTokenDetails } from "@/helpers/getTokenDetails"
import User from "@/models/User"
import { NextRequest,NextResponse } from "next/server"

connect()

export async function GET(request:NextRequest){
    try {
        const userId = await getTokenDetails(request)
        const user = await User.findOne({_id:userId}).select("-password")
        return NextResponse.json({
            message:"user fetched successfully",
            success:true,
            user
        })
        
    } catch (error:any) {
        return NextResponse.json({
            message:"error to fetch user details",
            success:false,
        })
    }
}