import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

export function TopNav() {
    return (
        <nav className="flex justify-between w-full p-4 font-semibold text-xl bg-white shadow-md">
            <Link href="/">
                <div>SV Baseball</div>
            </Link>

            <div>
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