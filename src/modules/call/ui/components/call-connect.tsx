"use client";

import {LoaderIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";

import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";
import { CallUI } from "./call-ui";

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
};

export const CallConnect = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage,
}: Props) => {
    const trpc = useTRPC();
    const {mutateAsync: generateToken} = useMutation(
        trpc.meetings.generateToken.mutationOptions(),
    );

    console.debug("Initializing CallConnect", {
        meetingId,
        meetingName,
        userId,
        userName,
    });

    const [client, setClient] = useState<StreamVideoClient>();
    useEffect(() => {
        console.debug("Creating StreamVideoClient", { userId, userName });
        const _client = new StreamVideoClient({
           apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
           user: {
            id: userId,
            name: userName,
            image: userImage,
           },
           tokenProvider: generateToken,
        });

        console.debug("StreamVideoClient created");

        setClient(_client);

        return () => {
            console.debug("Disconnecting StreamVideoClient");
            _client.disconnectUser();
            setClient(undefined);
        };
    }, [userId, userName, userImage, generateToken]);

    const [call, setCall] = useState<Call>();
    useEffect(() => {
        if (!client) return;

        console.debug("Creating call", { meetingId });
        const _call = client.call("default", meetingId);
        //_call.camera.disable();
        //_call.microphone.disable();
        setCall(_call);
        console.debug("Call created");

        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                console.debug("Cleaning up call");
                _call.leave();
                _call.endCall();
                setCall(undefined);
            }
        };
    }, [client, meetingId]);

    if (!client || !call) {
        console.debug("Waiting for client or call", {
            hasClient: Boolean(client),
            hasCall: Boolean(call),
        });
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        );
    }

    console.debug("Rendering call components");
    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI meetingName={meetingName}/>
            </StreamCall>
        </StreamVideo>
    );
};