import { router } from "@workspace/trpc";
import { GetAllProvidersFromAccount } from "./getAllProvidersFromAccount"
import { createSocialAccount } from "./addSocialAccount";

export const providers = router({
  GetAllProvidersFromAccount,
  createSocialAccount
})
