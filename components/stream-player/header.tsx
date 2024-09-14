"use client"

import { useParticipants, useRemoteParticipant } from "@livekit/components-react";
import { UserAvatar, UserAvatarSkeleton } from "../user-avatar";
import { VerifiedMark } from "../verified-mark";
import { UserIcon } from "lucide-react";
import { Actions, ActionSkeleton } from "./actions";
import { Skeleton } from "../ui/skeleton";

interface HeaderProps {
    hostName: string;
    hostIdentity: string;
    viewerIdentity: string;
    imageUrl: string;
    isFollowing: boolean;
    name: string;
}

export const Header = ({
    hostName,
    hostIdentity,
    viewerIdentity,
    imageUrl,
    isFollowing,
    name,
}: HeaderProps) => {

    const participants = useParticipants();
    // iski help se stream ka host decide ho jaiye ga jiski id humne bheji h.
    const participant = useRemoteParticipant(hostIdentity);

    // !! participant ko boolean me convert krdege. yadi participant me koi value hogi toh true aa jaiye ga isLive me aur empty hoga toh false aa jaiye ga isLive me.
    // jab bhi user livestream start krega toh livekit k useRemoteParticipant webhook me data chla jaiye ga aur hum livekit ki help se room create ho jaiye ga jisme us user ki livestream chal rhi hogi jise dusre user join kr skte h aur hume livekit k useParicipants() hooks ki help se pta chal jaiya ki humari livestream me kitne members h aur unki details aur kon naya user stream me aaya h aur kisne stream left ki h.
    const isLive = !!participant;
    // participants.length ki help se hume sbhi viewer mil jaiye ge livestream k jin me se 1 viewer livestream ka host bhi hoga toh hum ushe minus kr dege.
    const participantCount = participants.length - 1;

    const hostAsViewer = `host-${hostIdentity}`;
    const isHost = viewerIdentity === hostAsViewer;


    return (
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
            <div className="flex items-center gap-x-3">
                <UserAvatar 
                    imageUrl={imageUrl}
                    username={hostName}
                    size="lg"
                    isLive={isLive}
                    showBadge
                />
                <div className="space-y-1">
                    <div className="flex items-center gap-x-2">
                        <h2 className="text-lg font-semibold">
                            {hostName}
                        </h2>
                        <VerifiedMark />
                    </div>
                    <p className="text-sm font-semibold">
                        {name}
                    </p>
                    {
                        isLive ? (
                            <div className="font-semibold flex gap-x-1 items-center text-xs text-green-500">
                                <UserIcon className="h-4 w-4" />
                                <p>
                                        {participantCount} {
                                            participantCount === 1 ? "viewer" : "viewers"
                                        }
                                </p>
                            </div>
                        ) : (
                            <p className="font-semibold text-xs text-muted-foreground">
                                Offline
                            </p>
                        )
                    }
                </div>
            </div>
            <Actions 
                isFollowing={isFollowing}
                hostIdentity={hostIdentity}
                isHost={isHost}
            />
        </div>
    )
}

export const HeaderSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
            <div className="flex items-center gap-x-2">
                <UserAvatarSkeleton size="lg" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <ActionSkeleton />
        </div>
    )
}