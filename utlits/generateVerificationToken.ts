import { randomUUID } from "crypto";
import prisma from "./prisma"


export const getVerificationToken = async(email:string) => {
    
    await prisma.verificationToken.deleteMany({where:{email}})
        const newVerifiactionToken = await prisma.verificationToken.create({
            data:{
                email,
                expires:new Date(new Date().getTime() + 1000*60*60*2),
                token:randomUUID()
            }
        })
    return newVerifiactionToken
}

export async function generateForgetPasswordToken(email:string) {
    const token = await prisma.forgetToken.findFirst({where:{email}});
    if(!token) {
        const forgetToken = await prisma.forgetToken.create({
            data:{
                email,
                expires:new Date(Date.now() + 1000*60*60*2),
                token:randomUUID()
            }
        })
        return forgetToken
    }
    if(new Date(token.expires) < new Date()) {
        await prisma.forgetToken.delete({where:{email}});
        const forgetToken = await prisma.forgetToken.create({
            data:{
                email,
                expires:new Date(Date.now() + 1000*60*60*2),
                token:randomUUID()
            }
        })
        return forgetToken
    } 
    return token;
}