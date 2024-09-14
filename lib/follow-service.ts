import { db } from "./db";
import { getSelf } from "./auth-service";

export const getFollowedUsers = async () => {
    try {
        // yadi user logout h toh error throw kr dega.
    const self = await getSelf();

    // humne follow record me se un sbhi rows ko le liya jine me login user ki id followerId k equal thi kyoki hum followerId me us user ki id store krva rhe h jis ne follow kiya h.
    // jis-jis row me login user ki id followerId se match hui h us-us row me se hum following vali field ko include kr lege kyoki following vali field me humne us user ki saari information jise login user ne follow kiya h.
    // hum login user k dvara follow kiye gye sbhi user ki list ko frontend pr show krva dege aur hum in users ko recommended users ki list se bhi hta dege.
    const followedUsers = db.follow.findMany({
        where: {
            followerId: self.id,
            following: {
                blocking: {
                    none: {
                        blockedId: self.id
                    }
                }
            }
        },
        include: {
            following: {
                include: {
                    stream: {
                        select: {
                            isLive: true
                        }
                    },
                }
            }
        }
    })

    return followedUsers;

    } catch (error) {
        return [];
    }
}

// hum is function me user ki id ko accept krege aur check krege ki vo id humari h ya kisi aur user ki h. Yadi vo id humari hogi toh hum true return krdege kyoki hum humare follower h. Yadi vo id dusre user ki h toh hum follow collection me check krege ki humne us id vale user ko follow kr rhka h ya nhi.
export const isFollowingUser = async (id: string) => {
    try {
        // login user ko lege getSelf() method ki help se.
        const self = await getSelf();

        // jo id hume parameter me mili h ushe database me find krege.
        const otherUser = await db.user.findUnique({
            where: { id }
        });

        // yadi us id se user nhi milta toh error throw kr dege
        if(!otherUser){
            throw new Error("User not found")
        }

        // yadi other user aur login user same h toh true return kr dege
        if(otherUser.id === self.id){
            return true;
        }

        // follow collection me check krege ki koi document aisa h ki jisme followerId me login user ki id ho aur followingId me other user ki id ho.
        const existingFollow = await db.follow.findFirst({
            where: {
                followerId: self.id,
                followingId: otherUser.id
            }
        })

        // console.log(existingFollow);

        // jo bhi value milegi ushe !! ki help se boolean me convert kr k retrun krdege. Yadi null value h toh ushe false me convert krdega.
        return !!existingFollow;

    } catch (error) {
        return false;
    }
}


// hum login user ki details lege aur dusre user jiski id mili h uski details db me se lege. Yadi dusra user nhi milta h db me toh error throw krdege. Hum check krege ki login user aur other user same h toh error throw kr dege ki tum apne aap ko follow nhi kr skte. Hum follow collection me check krege ki phle se hi toh dusre user ko follow nhi kr rhka h. Yadi follow kr rhka h toh error throw kr dege. Yadi ye saari condition pass ho jati h toh follow collection me naya document bna dege.
export const followUser = async (id: string) => {
    // login user ki id lege.
    const self = await getSelf();

    // dusre user ko id k basics pr db me find krege.
    const otherUser = await db.user.findUnique({
        where: {
            id
        }
    })

    // dusra user nhi milta toh error throw kr dege.
    if(!otherUser) {
        throw new Error("User not found");
    }

    // login user aur dusra user same h toh error throw kr dege.
    if(otherUser.id === self.id){
        throw new Error("Cannot follow yourself");
    }

    // yadi dusre user ko phle se follow kr rhka h toh error throw kr dege.
    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        }
    });

    if(existingFollow){
        throw new Error("Already following");
    }

    // yadi upper vali sbhi cond thik h toh follow collection me 1 naya document create kr dege.
    const follow = await db.follow.create({
        data: {
            followerId: self.id,
            followingId: otherUser.id,
        },
        include: {
            following: true,
            follower: true,
        }
    })

    return follow;
}

// is function ki help se hum user ko unfollow kr skte h.
export const unfollowUser = async (id: string) => {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where: {
            id,
        }
    })

    if(!otherUser){
        throw new Error("User not found");
    }

    if(otherUser.id === self.id){
        throw new Error("Cannot unfollow yourself");
    }

    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id
        }
    })

    if(!existingFollow){
        throw new Error("Not following")
    }

    const follow = await db.follow.delete({
        where: {
            id: existingFollow.id
        },
        include: {
            following: true,
        }
    })

    return follow;

}