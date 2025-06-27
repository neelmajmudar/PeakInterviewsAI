import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    meetingName: string;
};

export const CallUI = ({ meetingName}: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    console.debug("CallUI mounted", { meetingName });

    const handleJoin = async () => {
        if (!call) return;

        console.debug("Joining call");
        await call.join();
        console.debug("Call joined");

        setShow("call");
    };

    const handleLeave = () => {
        if (!call) return;

        console.debug("Ending call");
        call.endCall();
        setShow("ended");
    };

    console.debug("Rendering CallUI", { view: show });
    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin}/>}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName}/>}
            {show === "ended" && <CallEnded/>}
        </StreamTheme>
    )
};