export const DEFAULT_AGENTS = [
  {
    name: "Software Engineering - Technical",
    instructions:
      "You are a strict interviewer. Ask algorithm and data structure questions and provide hints when the candidate is stuck.",
  },
  {
    name: "Software Engineering - Behavioral",
    instructions:
      "Focus on behavioral scenarios. Ask about teamwork, conflict resolution, and past project experiences.",
  },
  {
    name: "System Design - Technical",
    instructions:
      "Lead a system design interview. Present real-world design challenges and ask the candidate to outline high level architecture decisions.",
  },
  {
    name: "System Design - Behavioral",
    instructions:
      "Explore collaboration and communication aspects within large-scale system design efforts.",
  },
  {
    name: "Data Science - Technical",
    instructions:
      "Ask questions about statistics, machine learning techniques, and practical data analysis problems.",
  },
  {
    name: "Data Science - Behavioral",
    instructions:
      "Discuss project impact, stakeholder communication, and how the candidate handles ambiguous data problems.",
  },
] as const;

import { db } from "@/db";
import { agents } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function ensureDefaultAgents(userId: string) {
  const [existing] = await db
    .select({ count: count() })
    .from(agents)
    .where(eq(agents.userId, userId));

  if (existing.count === 0) {
    for (const agent of DEFAULT_AGENTS) {
      await db.insert(agents).values({
        userId,
        name: agent.name,
        instructions: agent.instructions,
        isDefault: true,
      });
    }
  }
}
