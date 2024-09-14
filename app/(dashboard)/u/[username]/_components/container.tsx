"use client"

// is file ki help se hum sidebar k expand hone aur collapse hone pr page ka data ki position ko set krege.

import { cn } from "@/lib/utils"
import { useCreatorSidebar } from "@/store/use-creator-sidebar"
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

interface ContainerProps {
    children: React.ReactNode;
}

export const Container = ({
    children
}: ContainerProps) => {

    const matches = useMediaQuery(`(max-width: 1024px)`)

    const { collapsed, onCollapse, onExpand } = useCreatorSidebar((state) => state);

    useEffect(() => {
        if(matches){
            onCollapse();
        }
        else{
            onExpand();
        }
    }, [matches, onCollapse, onExpand])

    return (
        <div className={cn(
            "flex-1",
            collapsed ? "ml-[70px]" : "ml-[70px] lg:ml-60"
        )}>
            {children}
        </div>
    )
}