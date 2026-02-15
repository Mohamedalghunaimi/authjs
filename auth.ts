import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./utlits/validationSchema"
import prisma from "./utlits/prisma"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter:PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events:{
    async linkAccount({user}) {
      const {email} = user ;
      await prisma.user.update(
        {
          where: { email: email! },
          data: {
            emailVerified:new Date()
          }
        }
      )
       

    }
  },
  callbacks:{
    async jwt({token,user}) {
      
      return token

    },
    async session({session,token}) {
      

      const user = await prisma.user.findUnique({where:{id:token.sub}})
      if(user && session) {
        const newUser = {...session.user,role:user.role,twoFactorEnabled:user.twoFactorEnabled};
        session.user = newUser ;

      }
      return session
    
    },



  },
  ...authConfig,
  providers:[
    ...authConfig.providers,
    Credentials(
      {
        credentials:{
        email: {},
        password: {},
        },
        authorize: async (credentials) => {
        const validation = LoginSchema.safeParse(credentials);
        if (validation.success) {
          const { email, password } = validation.data;
          const user = await prisma.user.findUnique({ where: { email } });
          
          if (!user || !user.password) return null;

          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) return user;
        }
        return null;
        }
      }
    ),
    
  ]
})