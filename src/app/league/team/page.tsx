// React
import { Suspense, use } from "react";

// UI Elements
import { 
  Avatar, 
  AvatarFallback 
} from "~/_components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/_components/ui/popover";
import { TeamsTableLoading } from "~/app/_features/team/components/TeamsLoading";

// Components
import { TeamDataTable } from "~/app/_features/team/components/team-data-table";
import { TeamSettingsDialogForm } from "~/app/_features/team/components/TeamSettingsDialogForm";

// Actions
import { getMyTeamAction, getMyTeamInfoAction } from "~/app/_features/team/actions/teamActions";
import { getTeamSettingsAction } from "~/app/_features/team/actions/teamSettingsActions";

export const dynamic = 'force-dynamic';

export default function TeamPage() {
  const teamData = use(getMyTeamAction());
  const teamSettings = use(getTeamSettingsAction());
  const myTeamInfo = use(getMyTeamInfoAction());

  const teamAbbrev = teamSettings?.teamAbbreviation || "TM";

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-[#12026d] to-[#15162c] p-4 pb-12 text-white">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4">
        {/* Team Header */}
        <div className="flex items-center justify-start gap-3 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <Avatar className="size-11 bg-white border-2 border-white/20 shadow-md">
                <AvatarFallback className="text-stone-900 font-bold text-sm">
                  {teamAbbrev}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-slate-900 border-white/15 text-white">
              <Suspense fallback={<p className="h-12 w-75 text-stone-400">Loading...</p>}>
                <TeamSettingsDialogForm teamSettingsData={teamSettings} />
              </Suspense>
            </PopoverContent>
          </Popover>

          <div>
            <Suspense fallback={<p className="h-8 w-48 bg-slate-800 rounded animate-pulse" />}>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {myTeamInfo.name}
              </h1>
            </Suspense>
            <p className="text-xs text-stone-400">
              Team Roster & Prospects
            </p>
          </div>
        </div>

        {/* Team Roster Table */}
        <div className="grow">
          <Suspense fallback={<TeamsTableLoading />}>
            <TeamDataTable data={teamData} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
