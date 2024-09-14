import { db } from "./db";
import { getSelf } from "./auth-service";


export const getRecommended = async() => {

    let userId;

    try {
        // hum currently login user ki id lege.
        const self = await getSelf();
        userId = self.id;
    } catch (error) {
        userId = null;
    }

    let users = [];

// yadi user id present hogi toh hum users ki array me se currently login user ko hta dege.
    if(userId) {
        // hum login user ko hta kr sbhi users ko le lege AND hum un users ko bhi hta dege jo login user ne follow kr rkhe h kyoki hum following user ko following ki list me dikhaye ge AND hum un users ko bhi hta dege jinhe login user ne block kr rhka h.
        users = await db.user.findMany({
            where: {
               AND: [
                {
                    NOT: {
                        id: userId,
                    }
                },
                {
                    NOT: {
                        followedBy: {
                            some: {
                                followerId: userId,
                            }
                        }
                    },
                },
                {
                    NOT: {
                        blocking: {
                            some: {
                                blockedId: userId
                            }
                        }
                    }
                }
              ]
            },
            include: {
                stream: {
                    select: {
                        isLive: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }
    // yadi user id nhi hogi toh hum sbhi users ko le lege array me.
    else{
        users = await db.user.findMany({
            include: {
                stream: {
                    select: {
                        isLive: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    // iski help se hum jitne bhi user db me h unhe lege.

    return users;
}

