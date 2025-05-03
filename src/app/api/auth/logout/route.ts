import { NextResponse } from "next/server"


export  async function GET(){

    try {
        const response = NextResponse.json(
            {
                message:"Logout Successfull",
                success:true
            }
             )
            // set the cookies to empty 

            response.cookies.set("token","",
                {
                    httpOnly:true
                }
            )

            return response
        
    } catch (error:unknown) {
        return NextResponse.json({
            "message":"an error occured",
            success:false
        },{status:500})
    }

}