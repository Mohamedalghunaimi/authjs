import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config"; // استورد الإعدادات الخفيفة فقط

// إنشاء نسخة من auth تعمل في بيئة الـ Edge
const { auth:middleware } = NextAuth(authConfig);
const notToUserRoutes = ["/login","/register"]

export default middleware ((req=> {
    
    const isLoggedIn:boolean = Boolean(req.auth)
    const path = req.nextUrl.pathname;
    if(isLoggedIn) {
        if(notToUserRoutes.includes(path)) {
            return NextResponse.redirect(new URL("/",req.nextUrl))
        }
    } else {
        if(!notToUserRoutes.includes(path)) {
            return NextResponse.redirect(new URL("/login",req.nextUrl))
        }        
    }
}));

export const config = {
    matcher:["/","/register","/login","/profile"]
}