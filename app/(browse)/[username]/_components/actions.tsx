"use client"

import { onBlock, onUnblock } from "@/actions/block"
import { onFollow, onUnfollow } from "@/actions/follow"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"

interface ActionsProps {
    isFollowing: boolean;
    userId: string;
}

export const Actions = ({
    isFollowing,
    userId
}: ActionsProps) => {
    // startTransition ki help se hume pta chal jaiye ga ki is time pr request server pr jaa rhi h.
    // iski help se hum button ko disable aur enable kr skte h jab tak server pr request ja rhi h aur server se response aa rha h.
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success(`You are now following ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success(`You have unfollowed ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const onClick = () => {
        if(isFollowing){
            handleUnfollow();
        }
        else{
            handleFollow();
        }
    }

    const handleBlock = () => {
        startTransition(() => {
            onBlock(userId)
            .then((data) => {
            // toast.success(`You blocked the ${data.blocked.username}`)
            if (data && data.blocked) { // Check if 'data' and 'data.blocked' are not undefined
                toast.success(`You blocked ${data.blocked.username}`);
            } else {
                toast.error("Block operation was successful, but user data is missing.");
            }
        })
            .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        // yadi login user ne dusre user ko phle se follow kr rhka h toh button ko disable kr dege aur yadi server se request aur response ka wait kr rhe h toh bhi button ko disable kr dege.
       <>
         <Button
         disabled={isPending} 
         variant="primary" 
         onClick={onClick}
        >
            {
                isFollowing ? "Unfollow" : "Follow"
            }
        </Button>
        <Button 
            onClick={handleBlock}
            disabled={isPending}
        >
            {
             "Block"
            }
        </Button>
       </>
    )
}