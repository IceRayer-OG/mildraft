"use client";
// import React & Nextjs
import Link from "next/link";
import { Suspense, useState } from "react";

// import Clerk
import { SignInButton, UserButton, Show } from "@clerk/nextjs";

// import UI
import { MenuIcon, X } from "lucide-react";
import { Button } from "~/_components/ui/button";

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex w-full flex-wrap bg-linear-to-t from-[#12026d] to-[#15162c] p-4 font-semibold text-white shadow-md">
      <div className="hidden w-full justify-between gap-4 md:flex">
        <div>
          <Button asChild variant="ghost" className="text-2xl font-semibold">
            <Link href="/">SV Baseball</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-lg font-semibold hover:bg-white/20"
          >
            <Link href="/league">League</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-lg font-semibold hover:bg-white/20"
          >
            <Link href="/league/team">Team</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-lg font-semibold hover:bg-white/20"
          >
            <Link href="/league/players">Players</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-lg font-semibold hover:bg-white/20"
          >
            <Link href="/league/draft">Draft</Link>
          </Button>
        </div>
        <div className="flex gap-4">
          <div>
            <Suspense>
              <Show when="signed-out">
                <SignInButton />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          className="flex size-11 items-center justify-center rounded-md p-2 hover:bg-white/10 active:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
        <div className="justify-center">
          <Button asChild variant="ghost" className="text-xl font-semibold">
            <Link href="/" onClick={() => setIsOpen(false)}>
              SV Baseball
            </Link>
          </Button>
        </div>
        <div className="flex gap-4">
          <Suspense>
            <Show when="signed-out">
              <SignInButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </Suspense>
        </div>
      </div>
      <div
        className={`${isOpen ? "flex flex-col w-full gap-1 pt-3 pb-2 border-t border-white/10 mt-2" : "hidden"} md:hidden`}
      >
        <Button
          asChild
          variant="ghost"
          className="justify-start text-base font-medium h-11 w-full px-3 hover:bg-white/15"
          onClick={() => setIsOpen(false)}
        >
          <Link href="/league">League</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start text-base font-medium h-11 w-full px-3 hover:bg-white/15"
          onClick={() => setIsOpen(false)}
        >
          <Link href="/league/team">Team</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start text-base font-medium h-11 w-full px-3 hover:bg-white/15"
          onClick={() => setIsOpen(false)}
        >
          <Link href="/league/players">Players</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start text-base font-medium h-11 w-full px-3 hover:bg-white/15"
          onClick={() => setIsOpen(false)}
        >
          <Link href="/league/draft">Draft</Link>
        </Button>
      </div>
    </nav>
  );
}
