"use client";
// import React & Nextjs
import Link from "next/link";
import { useState } from "react";

// import Clerk
import { SignInButton, UserButton, Show } from "@clerk/nextjs";

// import UI
import { MenuIcon } from "lucide-react";
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
            <Show when="signed-out">
              <SignInButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between gap-4 md:hidden">
        <MenuIcon className="h-6 w-6" onClick={() => setIsOpen(!isOpen)} />
        <div className="justify-center">
          <Button asChild variant="ghost" className="text-xl font-semibold">
            <Link href="/">SV Baseball</Link>
          </Button>
        </div>
        <div className="flex gap-4">
          <Show when="signed-out">
            <SignInButton />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
      <div
        className={`${isOpen ? "w-full items-center gap-4 p-4" : "hidden"} md:hidden`}
      >
        <div className="w-full">
          <div className="block">
            <Button
              asChild
              variant="ghost"
              className="text-sm font-semibold hover:bg-white/20"
            >
              <Link href="/league">League</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-sm font-semibold hover:bg-white/20"
            >
              <Link href="/league/team">Team</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-sm font-semibold hover:bg-white/20"
            >
              <Link href="/league/players">Players</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-sm font-semibold hover:bg-white/20"
            >
              <Link href="/league/draft">Draft</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
