"use client"
import { logout } from '@/server_Actions/serverActions'
import React from 'react'

const LogoutForm = () => {
  const logoutHandler = async (e:React.SubmitEvent) => {
    e.preventDefault()
    try {
      await logout()
      
    } catch (error) {
      
    }



  }
  return (
      <form onSubmit={logoutHandler}>
        <button type="submit" className=" bg-blue-600 p-2.5 text-white rounded-lg cursor-pointer  ">
          logout
        </button>
      </form>
  )
}

export default LogoutForm
