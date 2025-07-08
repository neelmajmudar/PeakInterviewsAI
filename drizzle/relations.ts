import { relations } from "drizzle-orm/relations";
import { user, account, agents, meetings, session } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	agents: many(agents),
	meetings: many(meetings),
	sessions: many(session),
}));

export const agentsRelations = relations(agents, ({one, many}) => ({
	user: one(user, {
		fields: [agents.userId],
		references: [user.id]
	}),
	meetings: many(meetings),
}));

export const meetingsRelations = relations(meetings, ({one}) => ({
	user: one(user, {
		fields: [meetings.userId],
		references: [user.id]
	}),
	agent: one(agents, {
		fields: [meetings.agentId],
		references: [agents.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));