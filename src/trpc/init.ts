import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import { polarClient } from '@/lib/polar';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { count, eq, and } from 'drizzle-orm';
import { ensureDefaultAgents } from '@/modules/agents/default-agents';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ctx,next})=>{
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session){
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized"});
  }
  await ensureDefaultAgents(session.user.id);
  return next({ctx: {...ctx, auth:session}})
});

export const premiumProcedure = (entity: "meetings" | "agents") => 
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const [userMeetings] = await db 
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));
    
    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          eq(agents.isDefault, false),
        ),
      );


      const isPremium = customer.activeSubscriptions.length > 0;
      const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
      const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

      const shouldThrowMeetingError = 
        entity === "meetings" && isFreeMeetingLimitReached && !isPremium;

      const shouldThrowAgentError = 
        entity === "agents" && isFreeAgentLimitReached && !isPremium;

      if (shouldThrowMeetingError) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the maximum number of free meetings",
        });
      }

      if (shouldThrowAgentError) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the maximum number of free agents",
        });
      }

      return next({ ctx: {...ctx, customer }});
  });