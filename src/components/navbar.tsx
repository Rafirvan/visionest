// navbar only

import { Button } from "./ui/button"
import Image from "next/image";
import Logo from "../../public/logo.png"
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Label } from "./ui/label";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { SignIn } from '@clerk/nextjs';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "~/components/ui/dialog"






export default function Navbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();


    return (
        <div id="Navbar" className="fixed h-[80px] w-full flex full-bg-white justify-between place-items-center pr-[7dvw]  md:pr-[25dvw] z-50 gap-7">

            <Link href="/" scroll={false}>
                <Image src={Logo} alt="VISIONEST" className=" h-[30px] w-[127px]  sm:h-[50px] sm:w-[212px] " />
            </Link>

            <div id="search" className="w-[40%] place-items-center gap-5 hidden lg:flex">

                <Label htmlFor="searchbar"><Search /></Label>
                <Input id="searchbar" placeholder="Search for projects..." />
            </div>


            {(!isLoaded || !isSignedIn) ?
                <Dialog>
                    <DialogTrigger>
                        <div className="p-3 inline-flex items-center justify-center rounded-md text-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90">Sign Up / Log In</div>
                    </DialogTrigger>
                    <DialogContent>
                        <SignIn signUpUrl="/sign-up" redirectUrl={router.pathname} />
                    </DialogContent>
                </Dialog>

                : <div className="md:scale-150"><UserButton afterSignOutUrl={router.pathname} /></div>}

        </div>
    )

}


