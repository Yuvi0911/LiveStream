
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LiveBadge } from "./live-badge";
import { OfflineBadge } from "./offline-badge";
import { useSidebar } from "@/store/use-sidebar";

// ye humne shadcn ki trh apna avatar ka size bnaya h jo ki by default h-8 w-8 hoga.
const avatarSize = cva(
    "",
    {
        variants: {
            size: {
                default: "h-8 w-8",
                lg: "h-14 w-14",
            },
        },
        defaultVariants: {
            size: "default"
        }
    }
)

interface UserAvatarProps extends VariantProps<typeof avatarSize> {
    imageUrl: string;
    username: string;
    isLive?: boolean;
    showBadge?: boolean;
}

export const UserAvatar = ({
    imageUrl,
    username,
    isLive,
    showBadge,
    size
}: UserAvatarProps) => {

    const { collapsed } = useSidebar((state) => state);

    const canShowLiveBadge = showBadge && isLive;
    const canShowOfflineBadge = showBadge && !isLive;

    return (
        <div className="relative">
            <Avatar
                className={cn(
                    isLive && "ring-2 ring-green-500 border border-background",
                    !isLive && "ring-2 ring-rose-600 border border-background",
                    avatarSize({ size })
                )}
            >
                <AvatarImage src={imageUrl} className="object-cover" />
                <AvatarFallback>
                    {username[0]}
                    {username[username.length - 1]}
                </AvatarFallback>
            </Avatar>
            {
                collapsed && canShowLiveBadge && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <LiveBadge />
                    </div>
                )
            }
            {
                collapsed && canShowOfflineBadge && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <OfflineBadge />
                    </div>
                )
            }
        </div>
    )
}

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSize> {

};

export const UserAvatarSkeleton = ({
    size,
}: UserAvatarSkeletonProps) => {
    return (
        <Skeleton className={cn(
            "rounded-full",
            avatarSize({ size })
        )} />
    )
}