import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

export function TopNav() {
    return (
        <nav className="flex justify-between w-full p-4 font-semibold text-xl bg-gradient-to-t from-[#12026d] to-[#15162c] text-white shadow-md">

            <div className="flex gap-4">
            <Link href="/">
                <div>SV Baseball</div>
            </Link>
            <Link href="/league">
                <div>League</div>
            </Link>
            <Link href="/league/team">
                <div>Team</div>
            </Link>
            <Link href="/league/players">
                <div>Players</div>
            </Link>
            
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