import { currentUser } from "@clerk/nextjs/server";

import { db } from "./db";

// is function ki help se hum currently login user ki details le skte h aur uska data show krva skte h.
export const getSelf = async() => {
    // clerk se current login user ki info lege.
    const self = await currentUser();

    // yadi info nahi milti toh usne login nhi kr rkha.
    if(!self || !self.username){
        throw new Error("Unauthorized");
    }

    // prisma ki help se hum database me us user ko find krege jisne clerk k dvara humari app me login kr rkha h. Clerk hume ek id deta h user create krte time jo ki unique hoti h humne us id ko database me store krva rkha h externalUserId k naam se, hum dono id ko match kr k database se login user ko le lege.
    const user = await db.user.findUnique({
        where: {externalUserId: self.id}
    });

    // yadi database me user nhi milta h toh error throw kr dege
    if(!user){
        throw new Error("User not found")
    }

    return user;
}

// is function ki help se login user apna dashboard dekh skta h. Koi dusra user kisi aur user ka dashboard nhi dekh skta url k through.
export const getSelfByUsername = async(username: string) => {
    // currently login user ki details lege clerk se.
    const self = await currentUser();

    // yadi user login nhi h aur vo url k through access kr rha h toh error throw kr dege.
    if(!self || !self.username){
        throw new Error("Unauthorized");
    }

    // db me username ki help se login user ko find krege.
    const user = await db.user.findUnique({
        where: {
            username
        }
    });

    // yadi user nhi milta h toh error throw kr dege.
    if(!user){
        throw new Error("User not found");
    }

    // yadi koi aur user kisi aur user ka dashboard access krna chahta h url k through toh error throw kr dege.
    if(self.username !== user.username){
        throw new Error("Unauthorized");
    }

    // user ko return krdege.
    return user;
}
