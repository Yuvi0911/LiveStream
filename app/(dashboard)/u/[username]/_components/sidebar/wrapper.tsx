"use client"

// is file me hum apna sibar design krege.

import { cn } from "@/lib/utils"
import { useCreatorSidebar } from "@/store/use-creator-sidebar"
import { useIsClient } from "usehooks-ts";

interface WrapperProps {
    children: React.ReactNode;
}

export const Wrapper = ({
    children
}: WrapperProps) => {

    // const isClient = useIsClient();

    const { collapsed } = useCreatorSidebar((state) => state)

    // if(!isClient){

    // }

    return (
        <aside className={cn(
            "fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50",
            collapsed && "lg:w-[70px]"
        )}>
            {children}
        </aside>
    )
}