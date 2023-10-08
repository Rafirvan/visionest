
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import React, { useState } from "react";



import { Share2 } from "lucide-react"

import {
    FacebookShareButton,
    LineShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";

import {
    FacebookIcon,
    LineIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";

export default function ShareButton({ link }: { link: string }) {

    const [open, setOpen] = useState(false);
    
    const [startTouchPosition, setStartTouchPosition] = useState<{ x: number, y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {

        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            if (touch) setStartTouchPosition({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        if (!startTouchPosition) return;

        if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            let deltaX, deltaY, distance
            if (touch)  deltaX = touch.clientX - startTouchPosition.x;
            if(touch) deltaY = touch.clientY - startTouchPosition.y;
            if(deltaX&& deltaY) distance= Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // If the touch moved less than 10 pixels, treat it as a tap.
            if (distance && distance < 10) {
                setOpen(prevOpen => !prevOpen);
            }

            setStartTouchPosition(null);
        }
    };



    return (

        <DropdownMenu open={open} onOpenChange={setOpen} >
            <DropdownMenuTrigger onTouchStart={e => { handleTouchStart(e)}} onTouchEnd={e=>handleTouchEnd(e)}
            ><Share2 className="relative top-1 hover:text-green-700" /></DropdownMenuTrigger>
            <DropdownMenuContent onCloseAutoFocus={e=>e.preventDefault()}>
                <DropdownMenuLabel >Share This Post</DropdownMenuLabel>
                <DropdownMenuItem onClick={e=>e.stopPropagation()} >
                    <FacebookShareButton url={link}><FacebookIcon className="hover:scale-110" /></FacebookShareButton>
                    <TwitterShareButton  url={link}><TwitterIcon className="hover:scale-110" /></TwitterShareButton>
                    <LineShareButton     url={link}><LineIcon className="hover:scale-110" /></LineShareButton>
                    <WhatsappShareButton url={link}><WhatsappIcon className="hover:scale-110" /></WhatsappShareButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

//todo:fix touch detection on mobile, current solution does not work!