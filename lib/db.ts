// jab bhi hum file me change kr k save krte h toh nextjs me hot reload hota h jiska matlab ye h ki pura code dubara load hota h jiske kaaran PrismaClient bhi baar-baar reload hoga toh is se bachne k liye aur PrismaClient ko sirf 1 baar load krne k liye humne ye code likha h. Code k dubara load hone pr yadi PrismaCLient phle se h toh vo reload nhi hoga dobara

import { PrismaClient } from "@prisma/client";

declare global{
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// production me hot reload nhi hota h toh hum ye code likhe ge production k liye.
if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db;
}