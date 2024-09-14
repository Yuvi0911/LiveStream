"use client"

// is file ki help se hum video dikhaye ge jab bhi user live hoga.
import { Participant, Track } from "livekit-client"
import { useEffect, useRef, useState } from "react";
import { useTracks } from "@livekit/components-react";
import { FullscreaanControl } from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./volume-control";

interface LiveVideoProps {
    participant: Participant;
}

export const LiveVideo = ({
    participant
}: LiveVideoProps) => {

    // useRef ki help se hum dom ko manipulate krege.
    // videoRef ki help se hum video vale element ko manipulate krege.
    const videoRef = useRef<HTMLVideoElement>(null);
    // wrapperRef ki help se hum wrapper vale element ko manipulate krege.
    const wrapperRef = useRef<HTMLDivElement>(null);

    // iski help se user screen k size ko manipulate krege jis pr hume live stream dikhanei h.
    const [isFullscreen, setIsFullscreen] = useState(false);
    // iski help se user livestream ki volume set kr skta h. 
    const [volume, setVolume] = useState(0);

    // jab volume change hogi toh ye function execute hoga. Iski help se user livestream ki value ko set kr skta h.
    const onVolumeChange = (value: number) => {
        setVolume(+value);
        if(videoRef?.current){
            videoRef.current.muted = value === 0;
            videoRef.current.volume = +value * 0.01;
        }
    }

    // iski help se user volume ko mute ya unmute kr skta h.
    const toggleMute = () => {
        const isMuted = volume === 0;

        setVolume(isMuted ? 50 : 0)

        if(videoRef?.current){
            // yadi currently muted h toh unmute ho jaiye gi aur unmute h toh mute ho jaiye gi.
            videoRef.current.muted = !isMuted;

            // yadi volumeisMuted na h toh volume 50 ho jaiye gi aur mute h toh 0 ho jaiye gi.
            videoRef.current.volume = !isMuted ? 0.5 : 0;
        }
    }

    // jab page first time load hoga toh volume 0 ho jaiye gi.
    useEffect(() => {
        onVolumeChange(0);
    }, [])


    // ye wrapper ko handle krega
    const toggleFullscreen = () => {
        if(isFullscreen) {
            document.exitFullscreen();
            // setIsFullscreen(false);
        }
        else if(wrapperRef?.current) {
            wrapperRef.current.requestFullscreen();
            // setIsFullscreen(true);
        }
    }

    // jab hum esc button se fullscreen exit krte h toh error aata h toh usko aise resolve krege.
    // ye state ko handle krega ki kab fullscreen krni h aur kab minimize krni h screen.
    // Jab aap "esc" button press karke fullscreen se bahar nikalte ho, toh ye function automatically trigger hota hai aur isFullscreen ko update karta hai.
    const handleFullscreenChange = () => {
        // yadi fullscreen h toh true varna false aa jaye ga.
        const isCurrentlyFullscreen = document.fullscreenElement !== null;
        setIsFullscreen(isCurrentlyFullscreen);
    }
    // Ye custom hook hai jo fullscreenchange event ko listen karta hai, aur jab bhi fullscreen state change hoti hai (jaise "esc" press karne se), toh ye handleFullscreenChange ko call karta hai, jo state ko manage karta hai.
    useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);


    useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
        if(videoRef.current) {
            track.publication.track?.attach(videoRef.current)
        }
    });

    return (
        <div ref={wrapperRef} className="relative h-full flex">
            <video ref={videoRef} width="100%" />
            <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
                <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
                    <VolumeControl 
                        onChange={onVolumeChange}
                        value={volume}
                        onToggle={toggleMute}
                    />
                    <FullscreaanControl
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                    />
                </div>
            </div>
        </div>
    )
}