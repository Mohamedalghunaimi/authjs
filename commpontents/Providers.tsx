"use client"
import React from 'react'
import { FaGithub } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import {Provider} from "@/utlits/types"
import { signInWithProviderInServer } from '@/server_Actions/serverActions'


const Providers = () => {
    const signInWithProvider = async(provider:Provider) => {
        try {
            await signInWithProviderInServer(provider)
            


        } catch (error) {
            throw error;
        }

    }


    return (
        <div className=' flex gap-2.5  '>
            <div onClick={()=>signInWithProvider('Google')} className=' w-1/2 flex justify-center items-center bg-slate-100 py-5 rounded-md duration-300 cursor-pointer  hover:bg-slate-300 '>
                <FcGoogle className=' text-2xl' />
            </div>
            <div  onClick={()=>signInWithProvider('Github')} className=' w-1/2 flex justify-center items-center bg-slate-100 py-5 rounded-md  duration-300 cursor-pointer  hover:bg-slate-300'>
                <FaGithub className=' text-2xl' />

            </div>
        </div>
    )
}

export default Providers
