import { NextResponse, NextRequest } from "next/server";



export function middleware(request: NextRequest){
    const path = request.nextUrl.pathname



    const isPublicPath = path === "/login" || path === "/register" || path === "/" 

    const token = request.cookies.get("token")?.value || ""

    if(isPublicPath && token){
        return NextResponse.redirect(new URL("/dashboard",request.url))
    }

    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL("/login",request.url))
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      "/",
      "/login",
      "/register",
      "/dashboard",
      "/completed",
      "/settings",
    ],
  }