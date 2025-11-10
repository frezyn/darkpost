
import { billing } from "@workspace/billings";
import { router } from "../trpc";
import { registerUser } from "./user/register";
import { providers } from "@workspace/providers"

const user = router({
  registerUser
})

export const publicroutes = router({
  user,
  billing,
  providers
})
