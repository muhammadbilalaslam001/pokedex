import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    headers: opts.req.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure; 