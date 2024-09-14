"use client"

import { useSidebar } from "@/store/use-sidebar";
import { User } from "@prisma/client";
import { UserItem, UserItemSkeleton } from "./user-item";

interface RecommendedProps {
    data: (User & {
        stream: {isLive: boolean} | null;
    })[];
}

export const Recommended = ({
    data,
}: RecommendedProps) => {

    const { collapsed } = useSidebar((state) => state);

    // console.log(data.length);

    // yadi sidebar collapsed nhi y aur data ki length 0 se badi h tbhi hum kuch show krege.
    const showLabel = !collapsed && data.length > 0;

    return (
        <div>
            {
                showLabel && (
                    <div className="pl-6 mb-4">
                        <p className="text-sm text-muted-foreground">
                            Recommended
                        </p>
                    </div>
                )
            }
            <ul className="space-y-2 px-1">
                {
                    data.map((user) => (
                       <UserItem
                            key={user.id}
                            username={user.username}
                            imageUrl={user.imageUrl}
                            isLive={user.stream?.isLive}
                        />
                    ))
                }
            </ul>
        </div>
    )
}

export const RecommendedSkeleton = () => {
    return (
        <ul className="px-2">
            {
                [...Array(3)].map((_, i) => (
                    <UserItemSkeleton key={i} />
                ))
            }
        </ul>
    )
}