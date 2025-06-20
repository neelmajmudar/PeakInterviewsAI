"use client";
import {useTRPC} from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/error-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>    
            {JSON.stringify(data, null, 2)}
        </div>
    );
};

export const AgentsViewError = () => {
    return (
        <ErrorState
        title="Error Loading Agents"
        description="Something went wrong"
        />
    );
};