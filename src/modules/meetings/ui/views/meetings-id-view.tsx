"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";

interface Props {
    meetingId: string;
};

export const MeetingIdView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [UpdateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

    const { dialog: RemoveConfirmation, confirm: confirmRemove } = useConfirm(
        "Are you sure?",
        "The following action will remove this meeting"
    );

    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId }),
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                //TODO: Invalidate free tier usage
                router.push("/meetings");
            },
        }),
    );

    const handleRemoveMeeting = async () => {
        await confirmRemove(() => {});

        await removeMeeting.mutateAsync({ id: meetingId});
    };

    return (
        <>
            {RemoveConfirmation}
            <UpdateMeetingDialog 
            open={UpdateMeetingDialogOpen}
            onOpenChange={setUpdateMeetingDialogOpen}
            initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                meetingId={meetingId}
                meetingName={data.name}
                onEdit={() => setUpdateMeetingDialogOpen(true)}
                onRemove={handleRemoveMeeting}
                />
                {JSON.stringify(data, null, 2)}
            </div>
        </>
    );
};


export const MeetingIdVeiwLoading = () => {
    return (
        <LoadingState
        title="Loading Meeting"
        description="This may take a few seconds"/>
    );
};

export const MeetingIdVeiwError = () => {
    return (
        <ErrorState
        title="Error Loading Meeting"
        description="Please try again later"/>
    );
};

