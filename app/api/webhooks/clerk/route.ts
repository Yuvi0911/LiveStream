// is webhook ko bnane k liye humne documentation(https://clerk.com/docs/integrations/webhooks/sync-data#create-an-endpoint-in-the-clerk-dashboard) se exact steps follow kiye h aure ye code bhi documentation se liya h

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { resetIngresses } from '@/actions/ingress'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

 
  const eventType = evt.type

//   Synchronize Clerk User with Database

  // niche vale code ki help se hum prisma ki help se mongodb me data store krege clerk se.

//   jab bhi naya user sign up krega clerk k authentication k through toh clerk ka webhook hume response me eventType bheje ga jisme user.created hoga.
// clerk hume payload me user ka sara data bheje ga.
// hum us data ko lege aur prisma ki help se apne database me store krva dege.
  if(eventType === "user.created"){
    await db.user.create({
        data: {
            externalUserId: payload.data.id,
            username: payload.data.username,
            imageUrl: payload.data.image_url,
            stream: {
              create: {
                name: `${payload.data.username}'s stream`
              }
            }
        }
    })
  }

//   yadi clerk ka webhook response me user.updated bheje ga toh iska matlab ye h ki clerk k through user ka data update hua h.
  if(eventType === "user.updated"){
    // hum clerk k dvara bheje gye payload me se us user ki id lege jisne apna data update kiya h aur ushe prisma ki help se database me find krege.
    // const currentUser = await db.user.findUnique({
    //     where: {
    //         externalUserId: payload.data.id
    //     }
    // })

    // yadi vo user database me nhi milta h toh error bhej dege response me.
    // if(!currentUser){
    //     return new Response("User not found", { status: 404 })
    // }

    // yadi vo user database me mil jata h toh prisma ki help se hum us user ka data update krdege jiski id hume clerk ne payload me di h.
    await db.user.update({
        where: {
            externalUserId: payload.data.id,
        },
        data: {
            username: payload.data.username,
            imageUrl: payload.data.image_url
        }
    })
  }

  if(eventType === "user.deleted"){
    // yadi stream chal rhi h aur user account delete kr deta h toh ingress reset ho jaiye gi.
    await resetIngresses(payload.data.id);

    await db.user.delete({
        where: {
            externalUserId: payload.data.id
        }
    })
  }

  return new Response('', { status: 200 })
}