import * as z from "zod";


export const RegisterSchema = z.object({
    email:z.string().email(),
    name:z.string().min(5).max(15),
    password:z.string().min(10)
})

export const LoginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(10),
    code:z.string().optional()
})

export const ForgetPasswordSchema =  z.object({
    email:z.string().email(),
})

export const ResetPasswordSchema =  z.object({
    password:z.string().min(8),
    confirmPassword:z.string().min(8),
    
})