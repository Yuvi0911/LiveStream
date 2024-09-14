import { db } from "./db";
import { getSelf } from "./auth-service";

export const getSearch = async (term?: string) => {
    let userId;

    try {
        // yadi user login h toh uski id le lege.
        const self = await getSelf();
        userId = self.id;

    } catch {
        userId = null;
    }

    let streams = [];
    console.log(userId)

    // login user searchbar me jiska naam likhe ga vo hume term me milaga aur hum usko db me find kr k user ko return krdege.
    if(userId){
        const blockedUsers = await db.block.findMany({
            where: {
                blockedId: userId
            },
            select: {
                blockerId: true,
            }
        })

        const blockedUserIds = blockedUsers.map((user) => user.blockerId);
        // yadi kisi user ne is login user ko block kr rhka h toh hum us user k dvara ki gyi livestream ko is login user ko nhi dikhaye ge search krne pr bhi.
        streams = await db.stream.findMany({
            where: {
                // user: {
                //     NOT: {
                //         blocking: {
                //             some: {
                //                 blockedId: userId , // Prevent showing streams from users who blocked this user
                //             },
                //         },
                //     }
                // },
               userId: {
                notIn: blockedUserIds,
               },
                OR: [
                {
                    name: {
                        contains: term,
                    }
                },
                {
                    user: {
                        username: {
                            contains: term
                        }
                    }
                }
               ] 
            },
            select: {
                user: true,
                id: true,
                name: true,
                isLive: true,
                thumbnailUrl: true,
                updatedAt: true
            },
            orderBy: [
                {
                    isLive: "desc",
                },
                {
                    updatedAt: "desc",
                }
            ]
        })
    }
    else{
        streams = await db.stream.findMany({
            where: {
               OR: [
                {
                    name: {
                        contains: term,
                    }
                },
                {
                    user: {
                        username: {
                            contains: term
                        }
                    }
                }
               ] 
            },
            select: {
                user: true,
                id: true,
                name: true,
                isLive: true,
                thumbnailUrl: true,
                updatedAt: true
            },
            orderBy: [
                {
                    isLive: "desc",
                },
                {
                    updatedAt: "desc",
                }
            ]
        })
    };

    return streams;
}