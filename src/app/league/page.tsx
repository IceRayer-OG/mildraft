// React
import Image from "next/image";
import { Suspense, use } from "react";

// UI Elements
import { Separator } from "~/_components/ui/separator";
import { PostsLoading } from "~/app/_features/posts/components/PostsLoading";
import { Skeleton } from "~/_components/ui/skeleton";
import { TeamsLoadingSkeleton } from "~/app/_features/team/components/TeamsLoading";
import { AddPostDialog } from "~/app/_features/posts/components/addPost";
import { SettingDialog } from "~/app/_features/leagues/components/SettingDialog";
import TeamList from "~/app/_features/team/components/TeamsList";
import Posts from "~/_components/Posts";
import { ResultsDataTable } from "../_features/drafts/components/draftresults-data-table";
import { DraftYearSelect } from "../_features/drafts/components/DraftYearSelect";

// Actions
import { getLeagueTeamsAction } from "~/app/_features/team/actions/teamActions";
import { getLeagueSettingsAction } from "~/app/_features/leagues/actions/leagueActions";
import { getLeaguePostsAction } from "../_features/posts/actions/postActions";
import {
  getDraftResultsAction,
  getAllDraftsAction,
} from "../_features/drafts/actions/draftActions";
import { isCommissionerUser } from "~/lib/auth";

interface LeaguePageProps {
  searchParams: Promise<{ draftId?: string }>;
}

export default async function LeaguePage(props: LeaguePageProps) {
  const searchParams = await props.searchParams;
  const posts = getLeaguePostsAction();
  const allLeagueTeams = getLeagueTeamsAction();
  const allDrafts = await getAllDraftsAction(1);

  // 1. Active draft takes precedence
  const activeDraft = allDrafts.find(
    (d) => d.status === "active" || d.status === "in_progress",
  );
  // 2. If no active draft, the most recent completed draft is the default
  const mostRecentCompletedDraft = allDrafts.find(
    (d) => d.status === "completed",
  );
  // 3. Fallback to newest draft or id 2
  const defaultDraft = activeDraft ?? mostRecentCompletedDraft ?? allDrafts[0];

  const selectedDraftId = searchParams.draftId
    ? Number(searchParams.draftId)
    : (defaultDraft?.id ?? 2);

  const selectedDraft =
    allDrafts.find((d) => d.id === selectedDraftId) ?? defaultDraft;

  const leagueSettingsData = await getLeagueSettingsAction({
    leagueId: 1,
    draftId: selectedDraftId,
  });
  const draftResultData = await getDraftResultsAction(selectedDraftId);
  const isCommissioner = await isCommissionerUser();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-linear-to-b from-[#12026d] to-[#15162c] p-3 sm:p-4 text-white">
      <div className="flex flex-col sm:flex-row min-h-16 items-start sm:items-center justify-between gap-3 pb-2">
        <div>
          <p className="text-xl font-semibold md:text-4xl tracking-tight">
            Welcome to {leagueSettingsData.name}!
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pr-1 sm:pr-4">
          {isCommissioner && (
            <Suspense fallback={<Skeleton className="h-4 w-20 bg-slate-800" />}>
              <SettingDialog />
            </Suspense>
          )}
          <Image
            src="https://fantasy-media.cbssports.com/baseball/siliconvalley/ealsm1LqkKSOqPRQ.jpg"
            width={48}
            height={48}
            alt="Avatar"
            className="size-10 sm:size-12 rounded-full object-cover border border-white/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-1 p-1 sm:p-2">
          <div className="flex flex-col gap-3 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">League Posts</p>
              <AddPostDialog />
            </div>
            <Suspense fallback={PostsLoading()}>
              <Posts posts={posts} />
            </Suspense>
          </div>
          <Separator />
          <div className="flex flex-col items-center pt-4">
            <p className="text-xl font-semibold">League Teams</p>
          </div>
          <div>
            <Suspense fallback={TeamsLoadingSkeleton()}>
              <TeamList teamList={allLeagueTeams} />
            </Suspense>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 p-1 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 sm:p-4">
            <div>
              <p className="text-xl md:text-3xl font-semibold">Draft Results</p>
              {selectedDraft?.draftYear && (
                <p className="text-xs text-stone-400">
                  Viewing {selectedDraft.draftYear} Draft
                </p>
              )}
            </div>
            {allDrafts.length > 0 && (
              <DraftYearSelect
                drafts={allDrafts}
                selectedDraftId={selectedDraftId}
              />
            )}
          </div>
          <Separator />
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex flex-col w-full space-y-3">
              <Suspense
                key={selectedDraftId}
                fallback={
                  <div>
                    <Skeleton className="h-31.25 w-62.5 rounded-xl bg-slate-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-62.5 bg-slate-800" />
                      <Skeleton className="h-4 w-50 bg-slate-800" />
                    </div>
                  </div>
                }
              >
                <ResultsDataTable data={draftResultData} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
