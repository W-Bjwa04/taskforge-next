"use client"
import React, { useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage(){

    const router = useRouter()

    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })

    const [buttonDisabled, setbuttonDisabled] = React.useState(true)

    useEffect(()=>{
        if(user.email.length>0 && user.password.length>0){
            setbuttonDisabled(false)
        }else{
            setbuttonDisabled(true)
        }
    },[user])

    const onLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault(); // Prevent page reload
        try {
            await toast.promise(
                axios.post("/api/auth/login", user),
                {
                  loading: "Logging account...",
                  success: "Login Successfull",
                }
              );
              console.log("He")
              // redirect to the login page 
              router.push("/dashboard")
              
        } catch (error) {
            toast.dismiss();
            toast.error('Login failed!');
        } 
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md bg-gray-900 text-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="text-center">
                <h1 className="text-3xl font-bold">TaskForge</h1>
                <p className="text-sm text-gray-400 mt-1">Login to your account</p>
                </div>

                <form className="space-y-4"  onSubmit={onLogin}>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                    <input
                    value={user.email}
                    onChange={(e)=>{
                        setUser({...user,email:e.target.value})
                    }}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300" htmlFor="password">Password</label>
                    <input
                     value={user.password}
                     onChange={(e)=>{
                         setUser({...user,password:e.target.value})
                     }}
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="text-right">
                    <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={buttonDisabled}
                    className={`w-full py-2 rounded-lg transition duration-200 
                        ${buttonDisabled 
                        ? 'bg-blue-600 opacity-50 cursor-not-allowed blur-[1px]' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        Login
                    </button>

                </form>

                <p className="text-center text-sm text-gray-400">
                Don't have an account?
                <Link href="/register" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>

    )
}