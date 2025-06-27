"use client";

import { LoaderIcon } from "lucide-react";

import { authClient} from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { useEffect } from "react";
import {CallConnect} from "./call-connect";

interface Props {
    meetingId: string;
    meetingName: string;
};

export const CallProvider = ({meetingId, meetingName}: Props) => {
    const {data, isPending} = authClient.useSession();

    useEffect(() => {
        console.debug("CallProvider session status", {
            isPending,
            hasData: Boolean(data),
        });
    }, [data, isPending]);

    if( !data || isPending) {
        console.debug("Waiting for session data", { isPending, hasData: Boolean(data) });
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        );
    }

    console.debug("Rendering CallConnect", { meetingId, meetingName });
    return (
        <CallConnect
        meetingId={meetingId} 
        meetingName={meetingName}
        userId={data.user.id}
        userName={data.user.name}
        userImage={
            data.user.image ??
            generateAvatarUri({ seed: data.user.name, variant: "initials"})
        }
        />
    );
};