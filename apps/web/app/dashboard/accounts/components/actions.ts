"use server"
import { signIn } from "@workspace/auth"

export async function handle_connect_tiktok() {

  await signIn("tiktok", {

    promp: "aa"

  })

}

