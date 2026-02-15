"use client"
import { forgetPassword } from '@/server_Actions/serverActions';
import { Rye } from 'next/font/google';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ForgetForm = () => {
    const [email,setEmail] = useState("");
    const submitHandler = async(e:React.SubmitEvent) => {
        e.preventDefault();
        if(!email) {
            return toast.error('email is required')
        }
        try {
            const result =await forgetPassword(email)
            if(!result?.success) {
                return toast.error(result?.message as string)
            }
            return toast.success(result.message as string)
        } catch (error) {
            console.error(error)
        }

    }
  return (
    <form onSubmit={submitHandler}  className='  flex flex-col gap-2.5 capitalize '>
        <label htmlFor="email">email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className=' border border-gray-300 p-1.5 rounded-lg' placeholder='email' id="email" type='email' required />
        <button type='submit' className=' bg-blue-500 py-2.5 capitalize text-xl font-semibold text-white rounded-lg mt-5 duration-300 hover:bg-blue-800  cursor-pointer'>
            sign up
        </button>


    </form>
  )
}

export default ForgetForm