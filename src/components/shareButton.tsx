
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
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);


    const handleTouchStart = (e:React.TouchEvent) => {
        e.preventDefault();
        setTimer(setTimeout(() => {
            setOpen(true);
        }, 200)); // 200ms delay
    };

    const handleTouchMove = () => {
        if (timer !== null) {
            clearTimeout(timer);
        }
    };


    return (

        <DropdownMenu open={open} onOpenChange={setOpen} >
            <DropdownMenuTrigger onTouchStart={e => { handleTouchStart(e)}} onTouchMove={handleTouchMove}
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