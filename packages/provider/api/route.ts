import { router } from "@workspace/trpc";
import { GetAllProvidersFromAccount } from "./getAllProvidersFromAccount"
import { createSocialAccount } from "./addSocialAccount";
import { disconnectAccount } from "./disconnectAccount";
import { createObjectLinkS3 } from "./s3/creteLinkObject";
import { publishPost } from "./tiktok/publish";
import { GetAllPostsFromAccount } from "./getAllPosts";
import { deletePost } from "./deletepost";

const upload = router({
  createObjectLinkS3,
  publishPost
})

export const providers = router({
  GetAllProvidersFromAccount,
  createSocialAccount,
  deletePost,
  disconnectAccount,
  GetAllPostsFromAccount,
  upload
})
