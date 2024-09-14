"use client"

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

interface ContainerProps {
    children: React.ReactNode;
}

export const Container = ({
    children
}: ContainerProps) => {
    // yadi screen ka size 1024px se chota h toh matches me true aa jaye ga.
    const matches = useMediaQuery("(max-width: 1024px)")

    const { collapsed, onCollapse, onExpand } = useSidebar((state) => state)

    useEffect(() => {
        // yadi screen ka size 1024px se chota h toh matches me true aa jaye ga aur hum sidebar ko colapse kr dege.
        if(matches){
            onCollapse();
        }
        // yadi screen ka size 1024px se bada h toh sidebar ko expand kr dege mtlb ki sidebar ko dikha dege.
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