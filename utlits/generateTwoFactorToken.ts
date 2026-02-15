import { randomInt } from "crypto";
import prisma from "./prisma";
import bcrypt from "bcryptjs";


export async function generateTwoFactorToken(email:string) {

    await prisma.twoFactorToken.deleteMany({
    where: { email },
    });
    const otp = randomInt(100000,1000000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp,salt)

    const newToken = await prisma.twoFactorToken.create({
        data:{
            email,
            expires: new Date(Date.now() + 1000*60*10),
            token:hashedOtp
        }
    })
    return {
        ...newToken,
        token:otp
    }

}