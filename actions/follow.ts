"use server"

import { followUser, unfollowUser } from "@/lib/follow-service"
import { revalidatePath } from "next/cache";

// hume us user ki id milegi jise hume follow krna h.
export const onFollow = async (id: string) => {
    try{
        // hum us id ko followUser function ko de dege ayr vo hume kuch value return krdega. Us k basics pr hum apne routes ko revalidate or reload krdege jis se naya data load ho jaiye ka apne aap.
        const followedUser = await followUser(id);

        revalidatePath("/")

        if(followedUser){
            revalidatePath(`/${followedUser.following.username}`)
        }

        return followedUser;

    }
    catch(error){
        throw new Error("Internal Error")
    }
}

export const onUnfollow = async (id: string) => {
    try {
        const unfollowedUser = await unfollowUser(id);

        revalidatePath("/")

        if(unfollowedUser){
            revalidatePath(`/${unfollowedUser.following.username}`);
        }
        
        return unfollowedUser;

    } catch (error) {
        throw new Error("Internal Error")
    }
}