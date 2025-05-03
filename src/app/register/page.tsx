"use client"
import React, { useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUpPage(){

    const router = useRouter()

    const [user, setUser] = React.useState({
        email: "",
        password: "",
        confirmPassword : ""
    })

    const [buttonDisabled, setbuttonDisabled] = React.useState(true)

    useEffect(() => {
        if (user.email.length>0 && user.password.length>0 && user.confirmPassword.length>0) {
            setbuttonDisabled(false)
        } else {
            setbuttonDisabled(true)
        }
    }, [user])

    // fuction for sign up 

    const onSignUp = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault(); // Prevent page reload
        if(user.password !== user.confirmPassword){
            toast.error("Password and confirm password does not match")
            return
        }
        try {
            await toast.promise(
                axios.post("/api/auth/register", user),
                {
                  loading: "Creating account...",
                  success: "Account Created",
                  error: "Something went wrong",
                }
              );

              // redirect to the verify email page 
              router.push("/notify-verification")
              
        } catch (error) {
            toast.dismiss();
            toast.error('Signup failed!');
        } 
    }

    


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
            <div className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md">
                    <div className="mb-6 text-center">
                    <h1 className="text-3xl font-extrabold text-blue-400">TaskForge</h1>
                    <p className="text-sm text-gray-400 mt-1">Organize your life, one task at a time.</p>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4 text-center">
                        Create An Account
                    </h2>

                    <form className="space-y-5" onSubmit={onSignUp}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                        type="email"
                        value={user.email}
                        onChange={(e)=>{
                            setUser({...user,email:e.target.value})
                        }}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                        type="password"
                        value={user.password}
                        onChange={(e)=>{
                            setUser({...user,password:e.target.value})
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                        <input
                        type="password"
                        value={user.confirmPassword}
                        onChange={(e)=>{
                            setUser({...user,confirmPassword:e.target.value})
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                </div>
                    <button
                    type="submit"
                    disabled={buttonDisabled}

                    

                    className={`w-full py-2 rounded-lg transition duration-200 
                        ${buttonDisabled 
                        ? 'bg-blue-600 opacity-50 cursor-not-allowed blur-[1px]' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        SignUp
                    </button>

                </form>

                <p className="mt-4 text-sm text-center text-gray-400">
                Already have an account?
                <Link href="/login" className="text-blue-400 hover:underline">Log in</Link>
                </p>
            </div>
        </div>

    )
}