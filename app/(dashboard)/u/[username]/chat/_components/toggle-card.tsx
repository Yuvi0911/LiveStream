"use client"

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTransition } from "react";
import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldTypes;
}

export const ToggleCard = ({
    label,
    value = false,
    field
}: ToggleCardProps) => {

    // startTransition ki help se hume pta chal jaiye ga ki is time pr request server pr jaa rhi h.
    // iski help se hum button ko disable aur enable kr skte h jab tak server pr request ja rhi h aur server se response aa rha h.
    const [isPending, startTransition] = useTransition();

    const onChange = () => {
        startTransition(() => {
            // field 1 array h jisme keval 3 values h.
            updateStream({ [field]: !value})
            .then(() => toast.success("Chat settings updated!"))
            .catch(() => toast.error("Something went wrong"))
        });
    }

    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className="space-y-2">
                    <Switch
                        disabled={isPending}
                        onCheckedChange={onChange}
                        checked={value}
                    >
                        {
                            value ? "On" : "Off"
                        }
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export const ToggleCardSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full" />
    )
}