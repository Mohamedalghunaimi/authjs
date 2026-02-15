import Providers from '@/commpontents/Providers'
import Link from 'next/link'
import React from 'react'
import RegisterForm from './RegisterForm'

const page = () => {
  return (
    <div className=' bg-white p-5  flex flex-col gap-5 w-[30%] rounded-xl shadow-lg'>
        <h1 className=' capitalize text-2xl font-semibold text-center  text-slate-700'>sign up to your account</h1>
        <RegisterForm />
        <Providers />
        <p className=' capitalize '>
            do have an account ? <Link href="/login" className=' underline text-blue-600 capitalize'>login</Link>
        </p>
    </div>
  )
}

export default page
