// React
// import Image from "next/image";
import { Suspense } from "react";
import { getLeaguePosts } from "~/server/queries";

// UI Elements
import { Separator } from "~/_components/ui/separator";
import { Avatar, AvatarImage,AvatarFallback } from "~/_components/ui/avatar";
import Posts from "~/_components/Posts";
import { PostsLoading } from "~/features/posts/components/PostsLoading";
import { Skeleton } from "~/_components/ui/skeleton";
import { AddPostDialog } from "~/features/posts/components/addPost";
import { SettingDialog } from "~/features/leagues/components/SettingDialog";
import TeamList from "~/features/team/components/TeamsList";
import { TeamsLoadingSkeleton } from "~/features/team/components/TeamsLoading";

// Actions
import { getLeagueTeamsAction } from "~/features/team/actions/teamActions";

export default async function LeaguePage() {
  const posts = getLeaguePosts();
  const allLeagueTeams = getLeagueTeamsAction();

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
            {/* <AvatarImage src="/_assets/avatar.png" alt="Avatar" /> */}
            <AvatarFallback className="text-black">SV</AvatarFallback>
          </Avatar> 
        </div>
      </div>  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 p-2">
          <div className="flex flex-col gap-4 items-center pb-4">
            <p className="text-xl font-semibold">League Posts</p>
            <Suspense fallback={PostsLoading()}>
              <Posts posts={posts} />
            </Suspense>
            <AddPostDialog />
          </div>
          <Separator />
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold">League Teams</p>
          </div>
          <div>
            <Suspense fallback={TeamsLoadingSkeleton()}>
              <TeamList teamList={allLeagueTeams} />
            </Suspense>
          </div>
        </div>
        <div className="col-span-3 p-4">
          <div className="flex flex-col gap-4 p-4 items-center">
            <p className="text-xl md:text-3xl">Pitcher Stats </p>
            <Separator />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-slate-800" />
                <Skeleton className="h-4 w-[200px] bg-slate-800" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 items-center">
            <p className="text-xl md:text-3xl">Batter Stats </p>
            <Separator />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-slate-800" />
                <Skeleton className="h-4 w-[200px] bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}