"use client"

// is file ki help se hum screen k size ko control krne vale Icon aur label dikhaye ge humare UI pr. Yadi fullscreen h toh icon aur label aur kuch hoge aur yadi fullscreen nhi h toh alag hoge.

import { Maximize, Minimize } from "lucide-react";
import { Hint } from "../hint";

interface FullscreaanControlProps {
    isFullscreen: boolean;
    onToggle: () => void;
}

export const FullscreaanControl = ({
    isFullscreen,
    onToggle
}: FullscreaanControlProps) => {

    const Icon = isFullscreen ? Minimize : Maximize;

    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

    return (
        <div className="flex items-center justify-center gap-4">
            <Hint label={label} asChild>
                <button
                    onClick={onToggle}
                    className="text-white p-1.5 hover:bg-white/10 rounded-lg"
                >
                    <Icon className="h-5 w-5"/>
                </button>
            </Hint>
        </div>
    )
}