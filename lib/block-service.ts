import { getSelf } from "./auth-service"
import { db } from "./db";

// logic => jis user ko login user block krega vo login user ko nhi dekh skta kahi bhi(follower list, recommended list, etc) lekin login user jisne block kiya h vo dusre user ki profile dekh skta h aur ushe unblock bhi kr skta h.

// is function ki help se hum check krege ki login user jis user pr click kr rha h jiskki hume parameter me se id mil rhi h vo id hum is function me bheje ge aur ye function check krega ki dusre user ne login user ko block kr rhka h ya nhi.
export const isBlockedByUser = async (id: string) => {
    try {
        // login user ki details lege getSelf() function ki help se
        const self =  await getSelf();

        // jis user pr login user ne click kiya h uski id find krege db me.
        const otherUser = await db.user.findUnique({
            where: {
                id
            }
        })

        // yadi vo user nhi milta toh error return kr dege.
        if(!otherUser){
            throw new Error("User not found");
        }

        // login user khud ko block nhi kr skta.
        if(otherUser.id === self.id){
            return false;
        }

        // hum findMany ka bhi use kr skte the jaise ki humne follow-service me kiya h.
        // block model me check krege ki koi aisi row h ki jisme blockerId me dusre user aur blocked user me login user ki id ho.
        const existingBlock = await db.block.findUnique({
            where: {
                  // humne prisma me ek unique constraint bnaya h blockerId, blockedId. In dono k combination se hume ye mila h. Ye basically optimized tarika database me find krne k liye. Ye kaam hum findMany se bhi kr skte the lekin vo less optimised way h.
                blockerId_blockedId: {
                    blockerId: otherUser.id,
                    blockedId: self.id
                }
            }
        })
        // console.log(existingBlock);

        // !! iski help se result boolean ki form me convert ho jaiye ga.
        return !!existingBlock;

    } catch (error) {
        return false
    }
}

// is function ki help se login user kisi bhi dusre user ko block kr skta h.
export const blockUser = async (id: string) => {
    // login user ki details le ge.
    const self = await getSelf();

    // login user khud ko block nhi kr skta.
    if(self.id === id){
        throw new Error("Cannot block yourself");
    }

    // id ki help se dusre user ko db me find krege.
    const otheUser = await db.user.findUnique({
        where: {
            id
        }
    })

    // yadi dusra user nhi milta h toh error throw kr dege.
    if(!otheUser){
        throw new Error("User not found");
    }

    // block model me find krege ki login user ne dusre user ko phle se block kr rhka h ya nhi.
    const existingBlock = await db.block.findUnique({
        where: {
            blockerId_blockedId: {
                blockerId: self.id,
                blockedId: otheUser.id
            }
        }
    })

    // yadi phle se block kr rhka h toh error throw kr dege.
    if(existingBlock){
        throw new Error("Already blocked");
    }

    // block model me nayi row create krdege jisme blockerId me login user ki id rkhege aur blockedId me jis user ko block kiya h uski id rhke ge aur jis user ko block kiya h uski details user model se include krlege kyoki block krne k baad hum success message me dikhaye ge ki login user ne kis user ko block kiya h.
    const block = await db.block.create({
        data: {
            blockerId: self.id,
            blockedId: otheUser.id
        },
        // iski help se hum basically vo kaam kr skte h jo hum mongodb me populate method ki help se krte h.
        include: {
            blocked: true
        }
    })

    // block me jis user ko block kiya h uski details include kri h humne User model ki help se.
    return block;
}

// is function ki help se login user kisi bhi dusre user ko unblock kr skta h.
export const unblockUser = async (id: string) => {
    // login user ki id lege.
    const self = await getSelf();

    // yadi login user khud ko unblock krna chata h toh hum error throw kr dege.
    if(self.id === id){
        throw new Error("Cannot Unblock yourself");
    }

    // dusre user jisko unblock krna h usko user db me find krege.
    const otherUser = await db.user.findUnique({
        where: {
            id
        }
    })

    // yadi vo user nhi milta toh error throw kr dege.
    if(!otherUser){
        throw new Error("User not found");
    }

    // block model me find krege ki login user ne dusre user ko block kr rhka h ya nhi.
    const existingBlock = await db.block.findUnique({
        where: {
            blockerId_blockedId: {
                blockerId: self.id,
                blockedId: otherUser.id
            }
        }
    })

    // yadi block nhi kr rhka h toh error throw kr dege.
    if(!existingBlock){
        throw new Error("Not Blocked");
    }

    // block model me vo row mil jati h jisme blockerId me login user ki id h aur blockedId me dusre user ki id h toh iska matlab ye h ki login user ne us user ko block kr rhka h. Usko unblock krne liye hum us row ko delete kr dege simply jisme blockerId me login user ki id h aur blockedId me dusre user ki id h. Hum blocked field ko include krege kyoki iski help se hum frontend pr dikha skte h ki login user ne kisko unblock kiya h.
    const unblock = await db.block.delete({
        where: {
            id: existingBlock.id
        },
        // iski help se humne unblock me blocked user ko add kr liya ab hum frontend pr iski help se success message me dikha skte h ki login user ne kis user ko unblock kiya h.
        include: {
            blocked: true
        }
    })

    return unblock;
}

export const getBlockedUsers = async () => {
    const self = await getSelf();

    const blockedUsers = await db.block.findMany({
        where: {
            blockerId: self.id,
        },
        include: {
            blocked: true,
        }
    });

    return blockedUsers;
}