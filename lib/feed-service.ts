import { db } from "./db"
import { getSelf } from "./auth-service"

export const getStreams = async () => {
    let userId;

    try {
        // login user
        const self = await getSelf();
        userId = self.id;

    } catch (error) {
        // logout user
        userId = null;
    }

    let streams = [];

    if(userId) {
        // yadi user logged in h toh hum ushe keval un users ki stream dikhaye ge jin ne ushe block nhi kr rhka h.

        streams = await db.stream.findMany({
            where: {
                user: {
                    NOT: {
                        blocking: {
                            some: {
                                blockedId: userId
                            }
                        }
                    }
                }
            },
            // include: {
            //     user: true
            // },
            select: {
                id: true,
                user: true,
                isLive: true,
                name: true,
                thumbnailUrl: true,
            },
            orderBy: [
                {
                    isLive: "desc",
                },
                {
                    updatedAt: "desc"
                }
            ]
        })
    }
    else {
        // yadi koi logout user home page pr h toh ushe sbhi live stream dikhaye ge.
        streams = await db.stream.findMany({
            // include: {
            //     user: true,
            // },
            select: {
                id: true,
                user: true,
                isLive: true,
                name: true,
                thumbnailUrl: true,
            },
            // live stream lege aur nayi live stream start hui h ushe phle lege.
            orderBy: [
                {
                    isLive: "desc",
                },
                {
                    updatedAt: "desc"
                }
            ]
        })
    }

    return streams;
}