"use client"
import { resetPassword } from '@/server_Actions/serverActions'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ResetForm = ({token}:{token:string}) => {

    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")

    const changePasswordHandler = async(e:React.SubmitEvent) => {
        e.preventDefault()
        if(confirmPassword!==password) {
            return toast.error("passwords is different")
        }
        try {
            const result = await resetPassword(token,{password,confirmPassword})
            if(!result?.success) {
                return toast.error(result?.message as string)
            } 
            return toast.success(result?.message as string)
        } catch (error) {
            console.error(error)
        }


    }
  return (
    <form onSubmit={changePasswordHandler} className='  flex flex-col gap-2.5 capitalize '>

        <label htmlFor='password'>password</label>
        <input  value={password} onChange={(e)=>setPassword(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='password' id="password" type='password' required />
        <label htmlFor='confirm'>confirm password</label>
        <input  value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className=' border border-gray-200 p-1.5 rounded-lg' placeholder='confirm password' id="confirm" type='password' required />
        <button type='submit' className=' bg-blue-500 py-2.5 capitalize text-xl font-semibold text-white rounded-lg mt-2.5 duration-300 hover:bg-blue-800  cursor-pointer'>
            change
        </button>
    

    </form>
  )
}

export default ResetForm
