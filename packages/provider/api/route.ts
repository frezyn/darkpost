import { router } from "@workspace/trpc";
import { GetAllProvidersFromAccount } from "./getAllProvidersFromAccount"
import { createSocialAccount } from "./addSocialAccount";
import { deleteaccount } from "./disconnectAccount";

export const providers = router({
  GetAllProvidersFromAccount,
  createSocialAccount,
  deleteaccount
})
