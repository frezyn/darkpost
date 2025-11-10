import { auth } from "@workspace/auth";

export async function createContext() {
  const session = await auth();

  return {
    session,
  };
}

export type Context = Awaited<typeof createContext>;
