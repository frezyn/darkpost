import { User } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      user: User
    } & User; // Keep default session user properties
  }
}
export * from "./src/auth"
