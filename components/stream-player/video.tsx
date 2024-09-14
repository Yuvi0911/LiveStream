"use client"

// is file ki help se hum dikhaye ge ki user kis time offline h, kis time loading ho rhi h aur kis time user live h.

import { ConnectionState, Track } from "livekit-client";
import {
    useConnectionState,
    useRemoteParticipant,
    useTracks
} from "@livekit/components-react"
import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";
import { Skeleton } from "../ui/skeleton";

// jisne livestream start ki h uski id aur name lege props ki form me.
interface VideoProps {
   hostName: string;
   hostIdentity: string 
}

export const Video = ({
    hostName,
    hostIdentity
}: VideoProps) => {

    // is hook ki help se hume user ki state ka pta chle ga ki vo live h ya offline h ya loading ho rhi h.
    // jab livekit prism se connection bna rha hoga tab isme connecting aa jaiye ga aur jab disconnect krege toh isme disconnecting aa jaiye ga.
    const connectionState = useConnectionState();
    // iski help se livestream me entry hogi.
    const participant = useRemoteParticipant(hostIdentity);

    // iski help se camera aur microphone ka access milega.
    const tracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone
    ]).filter((track) => track.participant.identity === hostIdentity);

    let content;

    // jab user ne livestream start nhi kr rhki h tab ye component dikhaye ge.
    if(!participant && connectionState === ConnectionState.Connected){
        content = <OfflineVideo username={hostName} />;
    } 
    // jab user livekit se request kr k pta kr rha h ki livestream start hui h ya nhi toh ye component dikhaye ge.
    else if(!participant || tracks.length === 0){
        content = <LoadingVideo label={connectionState} />
    }
    // jab user live aa jaiye stream me toh ye component render hoga.
    else{
        content = <LiveVideo participant={participant}/>
    };

    return (
        <div className="aspect-video border-b group relative">
            {content}
        </div>
    )
}

export const VideoSkeleton = () => {
    return (
        <div className="aspect-video border-x border-background">
            <Skeleton className="h-full w-full rounded-none" />
        </div>
    )
}