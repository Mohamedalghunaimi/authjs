"use client"
import { register } from '@/server_Actions/serverActions';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const RegisterForm = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("")
    const router = useRouter();

    const registerOperation = async(e:React.SubmitEvent)=> {
        e.preventDefault();
        try {
            if((!email.trim())||(!password.trim())||(!name.trim())) {
                return toast.success("missing details")
            }
            const result = await register({name,email,password})
            if(!result.success) {
                return toast.error(result.message)
            }
            toast.success(result.message)
            return router.push("/login")
        } catch (error) {
            console.error(error)
        }

    }



  return (
    <form onSubmit={(e)=> registerOperation(e)} className='  flex flex-col gap-2.5 capitalize '>
        <label htmlFor="name">name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='name' id="name" type='text' required />
        <label htmlFor="email">email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='email' id="email" type='email' required />
        <label htmlFor='password'>password</label>
        <input  value={password} onChange={(e)=>setPassword(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='password' id="password" type='password' required />
        <button type='submit' className=' bg-blue-500 py-2.5 capitalize text-xl font-semibold text-white rounded-lg mt-5 duration-300 hover:bg-blue-800  cursor-pointer'>
            sign up
        </button>


    </form>
  )
}

export default RegisterForm
