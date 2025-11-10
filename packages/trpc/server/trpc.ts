import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './contex';
import { Role } from '@workspace/database';


const t = initTRPC.context<Context>().create({
  isServer: true,
  allowOutsideOfServer: true,
});


const isAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You not have permissions. try be loged.",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== Role.Admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const router = t.router;
export const createCaller = t.createCallerFactory;
export const mergeRoutes = t.mergeRouters;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuth)
export const adminProcedure = authProcedure.use(isAdmin)
