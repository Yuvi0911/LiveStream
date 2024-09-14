"use client"

// is file ki help se hum apne sidebar ko collapse aur expand kr skte h store me state change kr k.

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useCreatorSidebar } from "@/store/use-creator-sidebar"
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

export const Toggle = () => {
    const { collapsed, onExpand, onCollapse } = useCreatorSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";

    return (
        <>
            {
             collapsed && (
                <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
                    <Hint label={label} side="right" asChild>
                    <Button onClick={onExpand} variant="ghost" className="h-auto p-2">
                        <ArrowRightFromLine className="h-4 w-4"/>
                    </Button>
                    </Hint>
                </div>
                )
            }
            {
                !collapsed && (
                    <div className="p-3 pl-6 mb-2 hidden lg:flex items-center w-full">
                        <p className="font-semibold text-primary">
                            Dashboard
                        </p>
                        <Hint label={label} side="left" asChild>
                            <Button onClick={onCollapse} className="h-auto p-2 ml-auto" variant="ghost">
                                <ArrowLeftFromLine className="h-4 w-4" />
                            </Button>
                        </Hint>
                    </div>
                )
            }
        </>
    )
}