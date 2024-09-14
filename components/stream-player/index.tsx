"use client"

// is file ki help se hum stream vala component bnaye ge.  Jab user offline hoga toh page pr offline component dikhaye ge. Jab loading ho rhi hogi toh loading component dikhaye ge. Jab user live stream kr rha hoga toh video player dikhaye ge.
import { useViewerToken } from "@/hooks/use-viewer-token";
import { Stream, User } from "@prisma/client"
import { LiveKitRoom } from "@livekit/components-react"
import { Video, VideoSkeleton } from "./video";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { cn } from "@/lib/utils";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";

type CustomStream = {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
}

type CustomerUser = {
    id: string;
    username: string;
    bio: string | null;
    stream: CustomStream | null;
    imageUrl: string;
    _count: {
        followedBy: number;
    }
}

interface StreamPlayerProps {
    user: CustomerUser
    stream: CustomStream;
    isFollowing: boolean;
}
// isFollowing ki value hamesa true hogi kyoki hume pta h ki ye humari stream h aur hum humare follower h by-default.

export const StreamPlayer = ({
    user, 
    stream,
    isFollowing
}: StreamPlayerProps) => {

    // jab bhi koi user livestream ko join krega toh ye 3 cheje mil jaiye gi jiski help se hum us user ko identify kr skte h.
    const { token, name, identity } = useViewerToken(user.id)

    // iski help se hum right hand side me chat dikhaye ge ya collapse krege.
    const { collapsed } = useChatSidebar((state) => state);

    // yadi ye 3 cheeje nhi hogi toh user stream bhi dekh skta h.
    if(!token || !name || !identity){
        return <StreamPlayerSkeleton />
    }

    return (
        <>
            {
                collapsed && (
                    <div className="hidden lg:block fixed top-[100px] right-2 z-50">
                        <ChatToggle />
                    </div>
                )
            }

            {/* jab bhi user livestream start krega toh iski help se 1 room create ho jaiye ga. */}
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className={cn(
                    "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
                    collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
                )}
            >
                {/* iski help se hum livestream ki video dikhaye ge us specific room me. */}
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                    <Video
                        hostName={user.username}
                        hostIdentity={user.id}
                    />
                    <Header
                        hostName={user.username}
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        imageUrl={user.imageUrl}
                        isFollowing={isFollowing}
                        name={stream.name}
                    />
                    <InfoCard 
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        name={stream.name}
                        thumbnailUrl={stream.thumbnailUrl}
                    />
                    <AboutCard
                        hostName={user.username}
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        bio={user.bio}
                        followedByCount={user._count.followedBy}
                    />
                </div>
                <div
                    className={cn(
                        "col-span-1",
                        collapsed && "hidden"
                    )}
                >
                    {/* iski help se hum live chat ko dikhaye ge us specific room me.*/}
                    <Chat
                        viewerName={name}
                        hostName={user.username}
                        hostIdentity={user.id}
                        isFollowing={isFollowing}
                        isChatEnabled={stream.isChatEnabled}
                        isChatDelayed={stream.isChatDelayed}
                        isChatFollowersOnly={stream.isChatFollowersOnly}
                    />
                </div>
            </LiveKitRoom>
        </>
    )
}

export const StreamPlayerSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
            <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                <VideoSkeleton />
                <HeaderSkeleton />
            </div>
            <div className="col-span-1 bg-background">
                <ChatSkeleton />
            </div>
        </div>
    )
}