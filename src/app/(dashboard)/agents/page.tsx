import { LoadingState } from "@/components/loading-state";
import { AgentsView, AgentsViewError } from "@/modules/agents/ui/views/agents-view"

import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Suspense } from "react";

import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
    searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
    if (!session) {
          redirect("/sign-in");
    } 
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
    return (
         <>
         <AgentsListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Loading Agents" description="This may take a few seconds"/>}>
                <ErrorBoundary fallback={<AgentsViewError/>}>
                    <AgentsView/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    );
};

export default Page;