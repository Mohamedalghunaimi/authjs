"use client"
import { enableTwoFactorVerification } from '@/server_Actions/serverActions'
import { truncate } from 'fs'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export interface props {
    user:{
    name:string,
    email:string ,
    image:null ,
    role?:'User' | 'Admin',
    twoFactorEnabled?:boolean
    } | undefined
}
const TwoFactorEnable = ({user}:props) => {
    const [enable,setEnable] = useState(user!.twoFactorEnabled || false);
    const submitHandler = async(e:React.SubmitEvent)=> {
        e.preventDefault();
        const result =  await enableTwoFactorVerification(user!.email as string,enable)
        if(!result.success) {
            return toast.error(result.message)
        }
        return toast.success(result.message)
        

    }

    
    return (
    <form onSubmit={submitHandler} className=' flex flex-col gap-2.5'>
        <div>
            <label htmlFor='enable'> enable two factor verification </label>
            <input 
            type='checkbox'
            id="enable"
            checked={enable}
            onChange={(e)=>setEnable(e.target.checked)}
            />
        </div>

        <button type='submit' className=' bg-blue-500 text-white py-2.5 capitalize rounded-xl cursor-pointer'>
            enable 
        </button>
        

    </form>
  )
}

export default TwoFactorEnable
