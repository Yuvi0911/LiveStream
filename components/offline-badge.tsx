import { cn } from "@/lib/utils";

interface OfflineBadgeProps {
    className?: string;
};

export const OfflineBadge = ({
    className,
}: OfflineBadgeProps) => {
    return (
        <div className={cn(
            "bg-rose-500 text-center p-0.5 px-1.5 rounded-md uppercase text-[10px] border border-background font-semibold tracking-wide",
            className,
        )}>
            Offline
        </div>
    )
}