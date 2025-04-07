// import Image from "next/image";
import { Suspense } from "react";
import { getLeaguePosts } from "~/server/queries";

import { Avatar, AvatarImage,AvatarFallback } from "~/_components/ui/avatar";
import Posts from "~/_components/Posts";
import { AddPostDialog } from "~/features/posts/components/addPost";
import { SettingDialog } from "~/features/leagues/components/SettingDialog";
import { PitcherRadarChart } from "~/features/players/components/PitcherRadarChart";

export default async function LeaguePage() {
  const posts = getLeaguePosts();

  return (
    <div className="flex flex-col min-h-screen min-w-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex min-h-20 items-center justify-between gap-4">
        <Avatar>
          <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
          <AvatarFallback className="text-black">SVB</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-xl md:text-4xl">Welcome to SvBaseball!</p>
        </div>
        <div className="flex gap-4 items-center content-right">
          <SettingDialog />
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
            <p>Settings Options Updated </p>
            <p>Team UI Updates Next </p>
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-4">
            <div>
              <PitcherRadarChart />
            </div>
            <div>
              <PitcherRadarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}