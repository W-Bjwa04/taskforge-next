import { NextRequest,NextResponse } from "next/server"


export  async function GET(request:NextRequest){

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
        
    } catch (error:any) {
        return NextResponse.json({
            "message":error,
            success:false
        },{status:400})
    }

}