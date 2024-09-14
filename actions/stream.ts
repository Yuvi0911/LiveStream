"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getSelf } from "@/lib/auth-service"
import { Stream } from "@prisma/client"

// is function ki help se hum stream model ki 3 values ko change kr skte h isChatEnabled, isChatFollowersOnly, isChatDelayed.
export const updateStream = async(values: Partial<Stream>) => {
    try {
        const self = await getSelf();
        
        const selfStream = await db.stream.findUnique({
            where: {
                userId: self.id
            }
        })

        if(!selfStream){
            throw new Error("Stream not found")
        }

        const validData = {
            thumbnailUrl: values.thumbnailUrl,
            name: values.name,
            // isLive: values.isLive,
            isChatEnabled: values.isChatEnabled,
            isChatFollowersOnly: values.isChatFollowersOnly,
            isChatDelayed: values.isChatDelayed,
        }

        const stream = await db.stream.update({
            where: {
                id: selfStream.id,
            },
            data: {
                ...validData
            }
        });

        revalidatePath(`/u/${self.username}/chat`);
        revalidatePath(`/u/${self.username}`);
        revalidatePath(`/${self.username}`);

        return stream;

    } catch (error) {
        throw new Error("Internal Error")
    }
}