// [username] => this tells the router that it is the dynamic part of the url.
// hum is url ko access bhi kr skte h.


import { StreamPlayer } from "@/components/stream-player";
import { isBlockedByUser } from "@/lib/block-service";
import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
// import { Actions } from "./_components/actions";

// parameter me username ki jagah string hogi.
interface UserPageProps {
    params: {
        username: string;
    }
}

const UserPage = async ({
    params
}: UserPageProps) => {

    // url me se username le ge jis username pr humne click kiya hua h uska. getUserByUsername() ye function us username ko database me find krega aur uska saara data hume de dega ushe db me find kr k..
    const user = await getUserByUsername(params.username);

    // yadi user nahi milta h toh ushe notFound() page pr redirect kr dege. Yadi koi user url me wrong name daal kr access krna chahta h toh ushe notFound page pr redirect kr dege.
    if(!user || !user.stream){
        notFound();
    }

    // isFollowingUser() function ki help se hum check krege ki humne jis user pr click kiya h ushe hum follow krte h ya nhi.
    const isFollowing = await isFollowingUser(user.id);

    const isBlocked = await isBlockedByUser(user.id);

    // yadi user ne kisi user ko block kr rhka h aur user url k through us user pr jana chata h toh hum ushe notFound page pr bhej dege.
    if(isBlocked){
        notFound();
    }


    return (
        <StreamPlayer
            user={user}
            stream={user.stream}
            isFollowing={isFollowing}
      />
    )
}

export default UserPage;