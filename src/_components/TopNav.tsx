"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "~/_components/ui/button";
import Link from 'next/link';
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export function TopNav() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="flex flex-wrap w-full p-4 font-semibold text-xl bg-gradient-to-t from-[#12026d] to-[#15162c] text-white shadow-md">
            <div className="hidden md:flex w-full justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" className="font-semibold text-xl">
                        <Link href="/">SV Baseball</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-xl">
                        <Link href="/league">League</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-xl">
                        <Link href="/league/team">Team</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-xl">
                        <Link href="/league/players">Players</Link>
                    </Button>
                    <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-xl">
                        <Link href="/league/draft">Draft</Link>
                    </Button>
                </div>
                <div className="flex gap-4">
                    <div>Docs</div>
                    <div>Help</div>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
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
            <div className={`${isOpen 
                ? "items-center w-full p-4 gap-4" 
                : "hidden"
                } md:hidden`
                }>
                <div className="w-full">
                    <div className="block">
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-l">
                            <Link href="/league">League</Link>
                        </Button>
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-l">
                            <Link href="/league/team">Team</Link>
                        </Button>
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-l">
                            <Link href="/league/players">Players</Link>
                        </Button>
                        <Button asChild variant="ghost" className="hover:bg-white/20 font-semibold text-l">
                            <Link href="/league/draft">Draft</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}