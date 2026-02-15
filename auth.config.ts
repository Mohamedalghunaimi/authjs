import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub({
        clientId:process.env.clientId as string,
        clientSecret:process.env.clientSecret
        
    }),
    Google({
        clientId:process.env.clientGoogleId as string,
        clientSecret:process.env.clientSecretGoogle as string
    })
],
} satisfies NextAuthConfig