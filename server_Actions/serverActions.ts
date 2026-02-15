/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import prisma from "@/utlits/prisma";
import { LoginSchema, RegisterSchema, ResetPasswordSchema } from "@/utlits/validationSchema"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { Provider } from "@/utlits/types";
import { generateForgetPasswordToken, getVerificationToken } from "@/utlits/generateVerificationToken";
import { sendLinkToResetPassword, sendLinkToVerifyEmail, sendTwoFactorToken } from "@/utlits/sendEmail";
import { generateTwoFactorToken } from "@/utlits/generateTwoFactorToken";

export async function login(data:z.infer<typeof LoginSchema>) {
    const validation = LoginSchema.safeParse(data);
    if(!validation.success) {
        return {
            success:false,
            message:validation.error.issues[0].message
        }
    }
    const {email,password,code} = validation.data;
    try {
        const user = await prisma.user.findUnique({where:{email}});
        if(!user) {
            return {
                success:false,
                message:"invalid info"
            }
        }
        if(!user?.emailVerified) {
            const token = await getVerificationToken(email)
            const domain = process.env.Domain;

            const link = `${domain}/verify?token=${token.token}`

            await sendLinkToVerifyEmail(email,link)
            return {
                success:true,
                message:"please check your email"
            }
        }


        if(user.twoFactorEnabled) {
            if(!code) {
                const token = await generateTwoFactorToken(email);
                await sendTwoFactorToken(email,token.token);
                return {
                    success:true,
                    message:"token is sent to your email",
                    twoFactorRequired: true
                }
            }
            const token = await prisma.twoFactorToken.findFirst({where:{email},orderBy:{createdAt:"desc"}})
            if(!token) {
                return {
                    success:false,
                    message:"invalid code"
                }
            }
            const isExpire = new Date(token.expires) < new Date();
            if(isExpire) {
                return {
                    success:false,
                    message:"token is expired"
                }
            }
            const isMatch = await bcrypt.compare(code,token.token)
            if(!isMatch) {
                return {
                    success:false,
                    message:"code is not match"
                }
            }
            await prisma.twoFactorToken.delete({where:{id:token.id}})
            await prisma.twoFactorConfirmation.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id },
            });
        }
        if (user.twoFactorEnabled) {
            const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({where:{userId:user.id}})
            if (twoFactorConfirmation) {
                await prisma.twoFactorConfirmation.delete({where:{id:twoFactorConfirmation.id}})
            }
        }
        await signIn('credentials',{email,password,redirectTo:"/"})
        return {
            success:true,
            message:"sign in successfully"
        }
    } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return { success: false, message: "email or password is wrong" };
                    default:
                        return { success: false, message: "something went wrong" };
                }
            }
        throw error
    } 
}


export async function register(data:z.infer<typeof RegisterSchema>) {
    const validation = RegisterSchema.safeParse(data);
    if(!validation.success) {
        return {
            success:false,
            message:validation.error.issues[0].message
        }
    }
    const {email,password,name} = validation.data;

    try {
        const user = await prisma.user.findUnique({where:{email}});
        if(user) {
            return {
                success:false,
                message:"user is already exists"
            }
        }
        const slat = await bcrypt.genSalt(10) ;
        const hashedPassword = await bcrypt.hash(password,slat)
        await prisma.user.create({
            data:{
                email,
                name,
                password:hashedPassword
            }
        })

        const token = await getVerificationToken(email)

        const domain = process.env.Domain;

        const link = `${domain}/verify?token=${token.token}`

        await sendLinkToVerifyEmail(email,link)



        return {
            success:true,
            message:"please check your email"
        }



    } catch (error) {
        console.log(error)
        return {
            success:false,
            message:"something went wrong in server"
        }
        
    }
    
}


export async function logout() {
    try {
        await signOut({redirectTo:"/login"});
    } catch (error:any) {
        if (error.type === "SignOutError") {
            throw error;
        }
        console.error("Logout failed:", error);
        throw error;    
    }
}

export async function signInWithProviderInServer(provider:Provider) {
    try {
        await signIn(provider,{redirectTo:"/profile"})
    } catch (error) {
        throw error
    }
}

export async function forgetPassword(email:string) {
    try {
        const user = await prisma.user.findUnique({where:{email}});
        if(!user) {
            return {success:false,message:"email is wrong"}
        }
        const forgetToken = await generateForgetPasswordToken(email);
        const domain = process.env.Domain;
        const link = `${domain}/reset-password?token=${forgetToken.token}`

        await sendLinkToResetPassword(email,link)

        return {
            success:true,
            message:"please check gmail "
        }
    } catch (error) {
        console.error(error)
    }

}

export async function resetPassword(token:string,{password,confirmPassword}:{password:string,confirmPassword:string} ) {
    const validation = ResetPasswordSchema.safeParse({password,confirmPassword});
    if(!validation.success) {
        return {
            success:false,
            message:validation.error.issues[0].message
        }
    }


    try {
        const forgetToken = await prisma.forgetToken.findUnique({where:{token}});
        if(!forgetToken) {
            return {
                success:true,
                message:"invalid token"
            }
        }
        const isExpire = new Date(forgetToken.expires) < new Date();
        if(isExpire) {
            return {
                success:false,
                message:'token is expires'
            }
        }
        await prisma.forgetToken.delete({where:{token}});
        const slat = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,slat);

        await prisma.user.update({
            where:{email:forgetToken.email as string},
            data:{
                password:hashedPassword
            }
        })

        return {
            success:true,
            message:"password is changed successfully"
        }


    } catch (error) {
        console.error(error)
    }

}

export async function enableTwoFactorVerification(email:string,enable:boolean) {
    try {
        const user = await prisma.user.findUnique({where:{email}});
        if(!user) {
            return {
                success:false,
                message:"invalid information"
            }
        }
        await prisma.user.update({
            where:{email},
            data:{twoFactorEnabled:enable}
        })
        return {
            success:true,
            message:`two factor verification is ${enable?"enabled":"disabled"} successfully!`
        }
    } catch (error) {
        console.error(error)
        return {
            success:false,
            message:"something went wrong "
        }
        
    }

}