import { router } from "@workspace/trpc";
import { GetAllProvidersFromAccount } from "./getAllProvidersFromAccount"
import { createSocialAccount } from "./addSocialAccount";
import { deleteaccount } from "./disconnectAccount";
import { createObjectLinkS3 } from "./s3/creteLinkObject";
import { publishPost } from "./tiktok/publish";

const upload = router({
  createObjectLinkS3,
  publishPost
})

export const providers = router({
  GetAllProvidersFromAccount,
  createSocialAccount,
  deleteaccount,
  upload
})
