
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
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
    return (

        <DropdownMenu>
            <DropdownMenuTrigger><Share2 className="relative top-1 hover:text-green-700" /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Share This Post</DropdownMenuLabel>
                <DropdownMenuItem>
                    <FacebookShareButton url={link}><FacebookIcon className="hover:scale-110" /></FacebookShareButton>
                    <TwitterShareButton url={link}><TwitterIcon className="hover:scale-110" /></TwitterShareButton>
                    <LineShareButton url={link}><LineIcon className="hover:scale-110" /></LineShareButton>
                    <WhatsappShareButton url={link}><WhatsappIcon className="hover:scale-110" /></WhatsappShareButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}