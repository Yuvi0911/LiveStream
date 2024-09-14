import Image from "next/image";
import { Poppins } from "next/font/google";

// ye hamare paas shadcn ki installation se aaya h.
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200","300","400","500","600","700","800"],
})

export const Logo = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-white rounded-full p-1">
                <Image src="/logo.svg" alt="UVLive" height="80" width="80"/>
            </div>
            <div className={cn(
                    "flex flex-col items-center",
                    font.className
                )}>
                <p className="text-xl font-semibold">
                    UVLive
                </p>
                <p className="text-sm text-muted-foreground">
                    Let&apos;s Watch
                </p>
            </div>
        </div>
    )
}