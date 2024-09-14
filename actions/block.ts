"use server"

import { getSelf } from "@/lib/auth-service"
import { blockUser, unblockUser } from "@/lib/block-service"
import { RoomServiceClient } from "livekit-server-sdk"
import { RemoveParticipantResponse } from "livekit-server-sdk/dist/proto/livekit_room"
import { revalidatePath } from "next/cache"

const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
)

export const onBlock = async (id: string) => {

        const self = await getSelf();

        let blockedUser;

        try {
            // yadi user login h jise hum block kr rhe h toh hum directly db me update kr dege.
            blockedUser = await blockUser(id);
        } catch (error) {
            // yadi user login nhi h aur guest ki trh humari stream dekh rha h toh toh hum ushe room me se kick kredege.


            
        }

        try {
            // hum logged user ko permanently block aur kick nhi kr skte h kyoki jab bhi vo user page refresh krega toh uske liye 1 nayi guest id generate hogi.
            // RemoveParticipant ek function h  jo ki room ki id lega jisme se user ko remove krna h aur us user ki id lega jise remove krna h. Ye function logged-in or logout dono users k liye kaam krega.
            await roomService.removeParticipant(self.id, id);

        } catch (error) {
            // This means user is not in the room.
        }

        revalidatePath(`/u/${self.username}/community`)


        return blockedUser;

}

export const onUnblock = async(id: string) => {
    try {
        const self = await getSelf();
        const unblockedUser = await unblockUser(id);

        revalidatePath(`/u/${self.username}/community`)

        // if(unblockedUser){
        //     revalidatePath(`${unblockedUser.blocked.username}`)
        // }

        return unblockedUser;
    } catch (error) {
        throw new Error("Internal Error");
    }
}  