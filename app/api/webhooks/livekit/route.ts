import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
)

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = headers();
    const authorization = headerPayload.get("Authorization")
    if(!authorization){
        return new Response("no authorization header", { status: 400 });
    }

    const event = receiver.receive(body, authorization);

    // console.log(event.ingressInfo?.ingressId);

    if(event.event === "ingress_started"){
        await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId
            },
            data: {
                isLive: true
            }
        })
    }

    if(event.event === "ingress_ended"){
        await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId
            },
            data: {
                isLive: false
            }
        })
    }

    return NextResponse.json({ success: true });
}