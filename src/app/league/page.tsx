// import Image from "next/image";
import { Suspense } from "react";
import { getLeaguePosts } from "~/server/queries";

import { Avatar, AvatarImage,AvatarFallback } from "~/_components/ui/avatar";
import Posts from "~/_components/Posts";
import { AddPostDialog } from "~/features/posts/components/addPost";
import { SettingDialog } from "~/features/leagues/components/SettingDialog";
import { Button } from "~/_components/ui/button";
import Link from "next/link";

export default async function LeaguePage() {
  const posts = getLeaguePosts();

  return (
    <div className="flex flex-col min-h-screen min-w-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex justify-between gap-4">
        <div className="h-24 w-24">Logo</div>
        <div>
          <p className="font-semibold text-xl md:text-4xl">Welcome to SvBaseball!</p>
        </div>
        <div className="content-right">
          <Avatar >
            <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
            <AvatarFallback className="text-black">SV</AvatarFallback>
          </Avatar> 
        </div>
      </div>  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 p-2">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-xl font-semibold">League Posts</p>
            <Suspense fallback={<div>Loading...</div>}>
              <Posts posts={posts} />
            </Suspense>
            <AddPostDialog />
          </div>
        </div>
        <div className="col-span-3 p-4">
          <div className="flex flex-col gap-4 items-center">
            <p>Settings Options </p>
            <p> option 1: A button placed in the corner </p>
            <SettingDialog />
            <p> option 2: A dedicated page accessed through the button</p>
            <Button variant="secondary">
              <Link href="/league/settings">Settings</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}