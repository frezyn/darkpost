"use server"
import { signIn } from "@workspace/auth"

type Props = {
  email?: string;
};

export async function actionLoginWithMagicLink({ email }: Props) {
  await signIn("resend", {
    email,
    redirect: true,
    redirectTo: "/"
  })
}


export const LoginWithGoogle = async () => {
  await signIn("google", {

    redirect: true,
    redirectTo: "/"

  })
}

export const LoginWithDiscord = async () => {
  await signIn("discord", {

    redirect: true,
    redirectTo: "/"
  })
}
