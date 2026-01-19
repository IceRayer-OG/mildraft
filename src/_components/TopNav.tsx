"use client";
// import React & Nextjs
import Link from 'next/link';
import { useState } from "react";

// import Clerk
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// import UI
import { MenuIcon } from "lucide-react";
import { Button } from "~/_components/ui/button";

export function TopNav() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <nav className="flex flex-wrap w-full p-4 font-semibold bg-linear-to-t from-[#12026d] to-[#15162c] text-white shadow-md">
            <div className="hidden md:flex w-full justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" className="font-semibold text-2xl">
                        <Link href="/">SV Baseball</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-lg">
                        <Link href="/league">League</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-lg">
                        <Link href="/league/team">Team</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-lg">
                        <Link href="/league/players">Players</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-lg">
                        <Link href="/league/draft">Draft</Link>
                    </Button>
                </div>
                <div className="flex gap-4">
                    <div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-between gap-4 md:hidden">
                <MenuIcon className="h-6 w-6" onClick={() => setIsOpen(!isOpen)} />
                <div className="justify-center">
                    <Button asChild variant="ghost" className="font-semibold text-xl">
                        <Link href="/">SV Baseball</Link>
                    </Button>
                </div>
                <div className="flex gap-4">
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
            <div className={`${isOpen ? "items-center w-full p-4 gap-4" : "hidden"} md:hidden`}>
                <div className="w-full">
                    <div className="block">
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-sm">
                            <Link href="/league">League</Link>
                        </Button>
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-sm">
                            <Link href="/league/team">Team</Link>
                        </Button>
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-sm">
                            <Link href="/league/players">Players</Link>
                        </Button>
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-sm">
                            <Link href="/league/draft">Draft</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}