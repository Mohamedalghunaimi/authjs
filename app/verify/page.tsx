import prisma from '@/utlits/prisma';
import React from 'react'
import Fail from './Fail';
import Success from './Success';

interface props {
    searchParams :Promise<{token:string}>
}

const page = async({searchParams}:props) => {
    const {token} = await searchParams ;
    if(!token) {
        return <Fail/>

    }
    const verifyToken = await prisma.verificationToken.findFirst({where:{token}});
    if(!verifyToken) {
        return <Fail/>

    }
    const isExpire = new Date(verifyToken.expires) < new Date() ;
    if(isExpire) {
        return <Fail/>
    }

    const {email} = verifyToken;

    await prisma.user.update({
        where:{
            email:verifyToken.email as string
        },
        data:{
            emailVerified:new Date()

        }
    })
    await prisma.verificationToken.delete({where:{email_token:{email,token}}})




  return (
    <Success />
  )
}

export default page
