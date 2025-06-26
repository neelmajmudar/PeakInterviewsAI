"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {MeetingGetOne} from "../../types";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: any;
};

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    // const router = useRouter();
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");

    const agent = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    ); 
 
    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                //TODO: Invalidate Free tier usage
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message);

                //TODO: Check if error code is FORBIDDEN, redirect to /upgrade
            },
        }),
    );

        const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                if (initialValues?.id){
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({id: initialValues.id})
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);

                //TODO: Check if error code is FORBIDDEN, redirect to /upgrade
            },
        }),
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({
                ...values,
                id: initialValues.id,
            });
        } else{
            createMeeting.mutate(values);
        }
    };

    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                name="name"
                control={form.control}
                render={({field}) => (
                   <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="e.g Math Consultations"/>
                    </FormControl>
                    <FormMessage />
                   </FormItem> 
                )}
                />
                <FormField
                name="agentId"
                control={form.control}
                render={({field}) => (
                   <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <FormControl>
                        <CommandSelect
                            options={(agent.data?.items ?? []).map(agent => ({
                                id: agent.id,
                                value: agent.id,
                                children: (
                                    <div className="flex items-center gap-x-2">
                                        <GeneratedAvatar
                                            seed={agent.name}
                                            variant="botttsNeutral"
                                            className="border size-6"
                                        />
                                        <span>{agent.name}</span>
                                    </div>
                                )
                            }))}
                            onSearch={setAgentSearch}
                            onSelect={field.onChange}
                            value={field.value}
                            placeholder="Select and agent"
                        />
                    </FormControl>
                    <FormDescription>
                        Not found what you're looking for?{" "}
                        <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setOpenNewAgentDialog(true)}
                        >
                             Create new agent
                        </button>
                    </FormDescription>
                    <FormMessage />
                   </FormItem> 
                )}
                />
                <div className="flex justify-between gap-x-2">
                   {onCancel && (
                    <Button variant="ghost" disabled={isPending} type="button"
                    onClick={() => onCancel()}>
                        Cancel
                    </Button>
                   )} 
                   <Button disabled={isPending} type="submit">
                    {isEdit ? "Update" : "Create"}
                   </Button>
                </div>
            </form>   
        </Form>
        </>
    );
};


