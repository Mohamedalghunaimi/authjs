import React from 'react'
import ForgetForm from './ForgetForm'

const page = () => {
  return (
    <div className=' bg-white p-5 rounded-xl  w-[30%] shadow-lg flex flex-col gap-2.5'>
        <h1 className=' text-center capitalize text-xl font-semibold text-slate-800'>forget password</h1>
        <ForgetForm />
      
    </div>
  )
}

export default page
