"use server"

import { v4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";

import { getSelf } from "@/lib/auth-service";
import { getUserById } from "@/lib/user-service";
import { isBlockedByUser } from "@/lib/block-service";

// live stream k host ki id milegi.
export const createViewerToken = async(hostIdentity: string) => {
    let self;

    try {
        // currently login user ki details lege.
        self = await getSelf();

    } catch (error) {
        // yadi logout user ya koi naya user jisne signup nhi kr rhka h vo stream dekhna chahta h toh ushe ek id provide krege jis se ushe identify kr skte.
        const id = v4();
        const username = `guest#${Math.floor(Math.random() * 1000)}`
        // self me humare dvara generate ki gyi id aur username ki value daal dege.
        self = { id, username}
    }
    
    // jisne livestream start kri h ushe find krege db me.
    const host = await getUserById(hostIdentity);

    // yadi vo nhi milta h toh error throw kr dege.
    if(!host){
        throw new Error("User not found");
    }

    // check krege ki currently login user stream k host k dvara block toh nhi h.
    const isBlocked = await isBlockedByUser(host.id);

    // yadi currently login user stream k host k dvara block h toh error throw kr dege.
    if(isBlocked){
        throw new Error("User is blocked")
    }

    // yadi login user aur stream ka host same h aur vo stream dekhna chahta h toh hume use modified identity deni hogi stream dekhne k liye kyoki ingress me hum 2 same id nhi de skte h.
    const isHost = self.id === host.id;

    // naya access token generate kr dege jo user host k dvara start ki gyi live stream dekhna chahta h uske liye. Token me us user ka naam aur id daal dege jo stram dekhna chahta h.
    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: isHost ? `host-${self.id}` : self.id,
            name: self.username
        }
    );

    // token ko permissions grant kr dege.
    token.addGrant({
        room: host.id,
        roomJoin: true,
        canPublish: false,
        canPublishData: true
    })

    // token ko return kr dege jwt ki help se encode kr k.
    return await Promise.resolve(token.toJwt());
}