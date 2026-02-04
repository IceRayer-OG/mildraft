// React
import Image from "next/image";
import { Suspense, use } from "react";
import { getLeaguePosts } from "~/server/queries";

// UI Elements
import { Separator } from "~/_components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "~/_components/ui/avatar";
import { PostsLoading } from "~/app/_features/posts/components/PostsLoading";
import { Skeleton } from "~/_components/ui/skeleton";
import { TeamsLoadingSkeleton } from "~/app/_features/team/components/TeamsLoading";
import { AddPostDialog } from "~/app/_features/posts/components/addPost";
import { SettingDialog } from "~/app/_features/leagues/components/SettingDialog";
import TeamList from "~/app/_features/team/components/TeamsList";
import Posts from "~/_components/Posts";

// Actions
import { getLeagueTeamsAction } from "~/app/_features/team/actions/teamActions";
import { getLeagueSettingsAction } from "~/app/_features/leagues/actions/leagueActions"; 


export default function LeaguePage() {
  const posts = getLeaguePosts();
  const allLeagueTeams = getLeagueTeamsAction();
  const leagueSettingsData = use(getLeagueSettingsAction({leagueId: 1, draftId: 2}));

  return (
    <div className="min-w-screen flex min-h-screen flex-col bg-linear-to-b from-[#12026d] to-[#15162c] p-4 text-white">
      <div className="flex min-h-20 items-center justify-between gap-4">
        <div>
        </div>
        <div>
          <p className="text-xl font-semibold md:text-4xl">
            Welcome to {leagueSettingsData.name}!
          </p>
        </div>
        <div className="content-right pr-4 flex items-center gap-2">
          <SettingDialog />
          <Image
            src="https://fantasy-media.cbssports.com/baseball/siliconvalley/ealsm1LqkKSOqPRQ.jpg"
            width={60}
            height={40}
            alt="Avatar"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-1 p-2">
          <div className="flex flex-col items-center gap-4 pb-4">
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
          <div className="flex flex-col items-center gap-4 p-4">
            <p className="text-xl md:text-3xl">Pitcher Stats </p>
            <Separator />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-31.25 w-62.5 rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-62.5 bg-slate-800" />
                <Skeleton className="h-4 w-50 bg-slate-800" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-4">
            <p className="text-xl md:text-3xl">Batter Stats </p>
            <Separator />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-31.25 w-62.5 rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-62.5 bg-slate-800" />
                <Skeleton className="h-4 w-50 bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
