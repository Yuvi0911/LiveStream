"use client"

// is file ki help se hum livestream k time jo live chat hogi us livestream me vo dikhaye ge.

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";
import { useChat, useConnectionState, useRemoteParticipant } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatCommunity } from "./chat-community";

// hume props me ye cheeje milege jiske basics pr hum chat dikhaye ge.
// hume host ka naam milega.
// Host ki identity milegi jis se hum ushe identify kr paye ge. 
// Viewer ka naam milega jis hum show krege jab vo user livestream me msg bheje ga toh us msg k saath us user ka naam bhi show krege. 
// isFollowing ki help se hum check krege ki jo user livestream dekh rha h usne host ko follow kr rhka h ya nhi. Kyoki host k paas ek aisa feature h ki jis se jo users host ko follow krte h keval vo hi us livestream ko dekh skte h.
// isChatEnabled ki help se hum check krege ki host ne chat ko enable kr rhka h ya nhi yadi host ne chat ko enable nhi kr rhka h toh koi bhi us livestream me msg nhi bhej skta.
// isChatDelayed ki help se hum check krege ki host ne chat ko delay kr rhka h ya nhi yadi host ne chat ko delay kr rhka h toh user naya msg 3 second (jo ki setTimeout function me set) k baad bhej skta h.
// isChatFollowersOnly ki help se hum check krege ki chat followers k liye h ya sab k liye h.
interface ChatProps {
    hostName: string;
    hostIdentity: string;
    viewerName: string;
    isFollowing: boolean;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
}

export const Chat = ({
    hostName,
    hostIdentity,
    viewerName,
    isFollowing,
    isChatEnabled,
    isChatDelayed,
    isChatFollowersOnly
}: ChatProps) => {

    // matches <= 1024px
    const matches = useMediaQuery('(max-width: 1024px)');

    // user chat vale sidebar ko collapse aur expand kr skta h. Isliye humne uski state ko manage krne k liye ushe store me store kiya h kyoki hum higher component se lower component me props bhej skte h lekin iska reverse nhi kr skte aur yadi humne lower component me sidebar ki state ko change kr diya toh higher component ko pta nhi chlega jisme humari app me hydration error aa jaiye ge, isliye hum sidebar ki state ko store me store krte k aur store me se hi uski state ko expand ya collapse me change krte h aur kisi bhi component ko us sidebar ki state k bare me jaana hota h ki vo collapse h ya expand h aur ushe change krna hota h toh vo store me se hi contact krta h.

    // variant ki help se hum decide krege ki hume sidebar me chat component dikhana h ya community component dikhana h.
    // onExpand ki help se hum sidebar ki state ko change kr skte h aur uske basics pr jsx me sidebar ko dikha skte h.
    const { variant, onExpand } = useChatSidebar((state) => state);

    // livekit ki help se connection bnaye ge
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);

    // iski help se pta chle ga ki online h ya nhi .
    const isOnline = participant && connectionState === ConnectionState.Connected

    // yadi online nhi h ya chat enable nhi h toh chat k sidebar ko hide kr dege.
    const isHidden = !isChatEnabled || !isOnline;

    const [value, setValue] = useState("");

    // livekit hume useChat() hook deta h jiski help se user livestream vale room (jo ki LivekitRoom ki help se create hua tha index.js me livestream start krne pr) me messages bhej skta h send ki help se aur hum un messages ko access kr skte h chatMessages ki help se.
    const { chatMessages: messages, send } = useChat()

    useEffect(() => {
        if(matches) {
            onExpand();
        }
    }, [matches, onExpand]);

    // jab messages change hoge tbhi ye function execute hogi nhi toh ye cache me jo phle value store ho rhki h ushi ko dikhaye ga. Is se hum unnecessary re-rendering se bach jaye ge. 
    const reversedMessages = useMemo(() => {
        // hum iski help se naye msg ko sbse niche dikhaye ge aur purane msg ko uppar bhejte jaiye ge.
        return messages.sort((a, b) => b.timestamp - a.timestamp);
    }, [messages]);

    // jaise hi user msg likh kr send button pr click krega toh send jo ki useChat hook se mila h uski help se vo msg us room me chla jaiye ga. aur setValue fir value me ya input box me empty string show kr degi.
    const onSubmit = () => {
        if(!send) return;

        send(value);
        setValue("");
    }

    // jab bhi input box me value change hogi toh setValue function value me nayi value ko set krdega
    const onChange = (value: string) => {
        setValue(value);
    }

    return (
        <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
            <ChatHeader />
            {
                variant === ChatVariant.CHAT && (
                    <>
                        <ChatList 
                           messages={reversedMessages} 
                           isHidden={isHidden}
                        />
                        <ChatForm 
                            onSubmit={onSubmit}
                            value={value}
                            onChange={onChange}
                            isHidden={isHidden}
                            isFollowersOnly={isChatFollowersOnly}
                            isDelayed={isChatDelayed}
                            isFollowing={isFollowing}
                        />
                    </>
                )
            }
            {
                variant === ChatVariant.COMMUNITY && (
                    <ChatCommunity
                        viewerName={viewerName}
                        hostName={hostName}
                        isHidden={isHidden}
                    />
                )
            }
        </div>
    )
}

export const ChatSkeleton = () => {
    return (
        <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
            <ChatHeaderSkeleton />
            <ChatListSkeleton />
            <ChatFormSkeleton />
        </div>
    )
}