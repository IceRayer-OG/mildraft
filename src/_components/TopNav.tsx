import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import Link from 'next/link';

export function TopNav() {
    return (
        <nav className="flex justify-between w-full p-4 font-semibold text-xl bg-gradient-to-t from-[#12026d] to-[#15162c] text-white shadow-md">

            <div className="flex gap-4">
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
        </nav>
    );
}