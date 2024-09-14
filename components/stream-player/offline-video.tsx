import { WifiOff } from "lucide-react";

interface OfflineVideoProps {
    username: string;
}

// is component ki help se hum jo user ka naam h ushe offline dikhaye ge ki usne abhi koi bhi livestream start nhi kr rkhi h.
export const OfflineVideo = ({
    username
}: OfflineVideoProps) => {
    return (
        <div className="h-full flex flex-col space-y-4 justify-center items-center">
            <WifiOff className="h-10 w-10 text-muted-foreground"/>
            <p className="text-muted-foreground">
                {username} is offline
            </p>
        </div>
    )
}