// navbar only

import Image from "next/image";
import Logo from "../../public/Logo.png"
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { SignIn } from '@clerk/nextjs';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "~/components/ui/dialog"
import Searchbar from "./searchbar";
import React, { useState, useEffect } from "react";
import useIsMobile from "~/hooks/useIsMobile";



export default function Navbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const isMobile = useIsMobile()

    useEffect(() => {
        const handleRouteChange = () => {
            // Close the dialog if the route changes
            setIsOpen(false);
        };
        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);

    return (

        <div id="Navbar" className="fixed h-[80px] w-[96%] translate-x-2 md:translate-x-0 md:w-[81%] flex full-bg-white justify-between place-items-center  z-50 gap-5">

            <Link href="/" scroll={false}>
                <Image src={Logo} alt="VISIONEST" className=" h-[30px] w-[127px]  sm:h-[50px] sm:w-[212px] " />
                <title className="hidden">Visionest</title>
            </Link>

            <Searchbar />

            {(user?.publicMetadata.role == "admin") && <Link href="/admin" scroll={false} className="underline text-gray-500">Admin Page</Link>}

            
            {!isSignedIn ?
                <Dialog open={isOpen} onOpenChange={setIsOpen} >
                    <DialogTrigger>
                        <div id="signin" className={` ${!isLoaded && "invisible"} p-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90`}>Sign Up / Log In</div>
                    </DialogTrigger>
                    <DialogContent id="dialog" className="scale-90 sm:scale-100 flex place-items-center" >
                        <div className={`scale-90 relative ${ isMobile? "right-[7%]":"right-[3%]" } sm:right-0 sm:scale-100 border-black`}>
                            <SignIn signUpUrl="/sign-up" redirectUrl={router.asPath} />
                        </div>
                    </DialogContent>
                </Dialog>

                : <div className="md:scale-150"><UserButton afterSignOutUrl="/"/></div>}

        </div>
    )

}


