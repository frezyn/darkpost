"use server"
import { signIn } from "@workspace/auth"

type Props = {
  email?: string;
};


export const LoginWithDiscord = async () => {
  await signIn("discord", {

    redirect: true,
    redirectTo: "/"
  })
}
