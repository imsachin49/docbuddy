import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { TRPCError, initTRPC } from '@trpc/server'

const t = initTRPC.create();
const middleware = t.middleware;

export const router = t.router;
export const publicProcedure = t.procedure;
