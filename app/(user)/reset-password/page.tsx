import React from 'react'
import ResetForm from './ResetForm'

interface props {
    searchParams:Promise<{token:string}>
}

const page = async({searchParams}:props) => {
    const {token} = await searchParams
  return (
    <div className=' bg-white p-5  flex flex-col gap-5 w-[30%] rounded-xl shadow-lg'>
        <h1 className=' capitalize text-2xl font-semibold text-center  text-slate-700'>sign in to your account</h1>
        <ResetForm token={token} />

    </div>
  )
}

export default page