/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/auth';
import React from 'react'

const page = async() => {
    const session = await auth();
    if(!session || !session.user) {
      return <div>
        not exist
      </div>
    }
    
  return (
    <div>


    </div>
  )
}

export default page