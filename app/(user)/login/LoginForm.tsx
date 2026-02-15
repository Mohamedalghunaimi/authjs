"use client"
import { login } from '@/server_Actions/serverActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Loading from './loading';

const LoginForm = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showOtpInput,setShowOtpInput] = useState(false)
    const [code,setCode] = useState('');
    const [loading,setLoading] = useState(false)

    const loginOpertaion = async(e:React.SubmitEvent) => {
        e.preventDefault() ;
        setLoading(true)
        try {
            const result = await login({email,password,code})
            if(!result.success) {
                return toast.error(result.message)
            }
            if(result.twoFactorRequired) {
                setShowOtpInput(true);
            }
            return toast.success(result.message)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    }
  return (
    <form onSubmit={loginOpertaion} className='  flex flex-col gap-2.5 capitalize '>
        {
            showOtpInput?
            
            <input value={code} onChange={(e)=>setCode(e.target.value)} type='text'  className=' border border-gray-200 p-1.5 rounded-lg' placeholder='code here' />
            :<>
        <label htmlFor="email">email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='email' id="email" type='email' required />
        <label htmlFor='password'>password</label>
        <input  value={password} onChange={(e)=>setPassword(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='password' id="password" type='password' required />
        <Link href={"/forget-password"} className=' hover:underline text-blue-500  duration-300'>
            forget password?
        </Link>
            </>
        }
        {
            loading? <Loading />:
        <button type='submit' className=' bg-blue-500 py-2.5 capitalize text-xl font-semibold text-white rounded-lg mt-2.5 duration-300 hover:bg-blue-800  cursor-pointer'>
            login
        </button>
        }


    

    </form>
  )
}

export default LoginForm
