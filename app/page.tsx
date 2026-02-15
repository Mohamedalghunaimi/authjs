import { auth } from "@/auth";
import LogoutForm from "@/commpontents/LogoutForm";
import TwoFactorEnable, { props } from "@/commpontents/TwoFactorEnable";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if(!session || !session.user) {
      return redirect("/login")
  }
  
  


  return (
    <div>
      <Link href="/login" className=" underline capitalize font-bold text-blue-600">
      go to login
      </Link>
      <LogoutForm />

      <Link href={"/profile"}>
        to profile
      </Link>
      <TwoFactorEnable 
      user={session.user as { 
    name: string; 
    email: string; 
    image: null; 
    role?: "User" | "Admin"; 
    twoFactorEnabled?: boolean; 
  }} />

    </div>
  );
}
