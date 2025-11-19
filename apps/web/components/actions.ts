"use server"
import { signIn, signOut } from "@workspace/auth"

type Props = {
  email?: string;
};


export const LoginWithDiscord = async (idAccount: string) => {
  await signIn("discord", {
    redirect: true,
    redirectTo: "/dashboard",
    idAccount,
  })
}


export const LoginWithGoogle = async () => {
  await signIn("google", {
    redirect: true,
    redirectTo: "/dashboard",
  })
}


export const SingOut = async () => {
  await signOut()
}
