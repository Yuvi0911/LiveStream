// is file me hum apne sidebar ko kab show krna h aur kab collapse krna h vo code likhe ge.

// Perils of Hydration => read this article for understanding hydration error.

"use client"

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
// import { useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";
import { ToggleSkeleton } from "./toggle";
import { RecommendedSkeleton } from "./recommended";
import { FollowingSkeleton } from "./following";

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({
    children,
}: WrapperProps) => {
    // const [isClient, setIsClient] = useState(false);

    // useState aur useEffect ka use krne ki jagah hum directly ishe use kr skte h. useIsClient() hook ki help se hum check krege ki abhi code client-side pr run ho raha h ya server- side pr run ho rha h. Client-side rendering matlab jo code browser mein run ho raha hai, aur server-side rendering matlab code server pe run ho raha hai aur browser mein HTML ke form mein bheja jata hai.
    // yadi isClient me true aata h toh iska matlab ye h ki code abhi client-side yani browser pr run ho rha h aur false aata h toh code server-side pr run ho rha h.
    const isClient = useIsClient();
    
    // if(isClient){
    //     console.log("code is running on client side")
    // }
    // else{
    //     console.log("code is running on server side")
    // }

    const { collapsed } = useSidebar((state) => state);

    // jab bhi user page refresh kre toh hume keval client side rendering krne h by default client side aur server side dono rendering hoti h.
    // useEffect(() => {
    //     setIsClient(true);
    // }, []);


    // isClient me false h toh iska matlab ye h ki code server-side pr run ho rha h abhi toh hum is time me frontend me ye code dikhaye ge.
    // jab page refresh ho rha hoga toh hum sidebar me kuch bhi data nhi dikhaye ge aur keval humare dvara bnaye gye skeleton show krege. Yadi hum ye condition nhi likhte toh jab hum page refresh krte toh server side rendering ki vjah se sidebar me user ka data dikhta.
    if(!isClient) {
        return (
            <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
                {/* ye skeleton server side rendering ko handle krne k liye h aur jo hum layout.tsx me suspense me skeleton use kiya h vo client side rendering ko handle krne k liye h.
                Aisa humne hydration error se bachne k liye kiya h. Hydration error => Hydration error tab occur hote h jab client side ka data server side k data se mis-match hota h. */}
                <ToggleSkeleton />
                <FollowingSkeleton />
                <RecommendedSkeleton />
            </aside>
        );
    }

    return (
        <aside className={cn(
            "fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50",
            collapsed && "w-[70px]"
        )}>
            {children}
        </aside>
    )
}