// React
import { Suspense, use } from "react";

// UI Elements
import { Avatar, AvatarImage, AvatarFallback } from "~/_components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/_components/ui/popover";
import { Skeleton } from "~/_components/ui/skeleton";

// Components
import { TeamSettingsForm } from "~/features/team/components/TeamSettingsForm";
import { teamColumns } from "~/features/team/components/team-columns";
import { DataTable } from "~/features/team/components/team-data-table";

// Actions
import {
  getMyTeamAction,
  getMyTeamInfoAction,
} from "~/features/team/actions/teamActions";
import { getTeamSettingsAction } from "~/features/team/actions/teamSettingsActions";


export default function TeamPage() {
  const data = use(getMyTeamAction());
  const teamSettings = use(getTeamSettingsAction());
  const myTeamInfo = use(getMyTeamInfoAction());

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#12026d] to-[#15162c] p-4 text-white">
      <div className="flex items-center justify-start gap-4">
        <div>
          <Popover>
            <PopoverTrigger className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                {/* <AvatarImage src="/_assets/avatar.png" alt="Avatar" /> */}
                <AvatarFallback className="text-black">SV</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <Suspense fallback={<Skeleton className="h-12 w-[200px] bg-slate-800" />}>
                <TeamSettingsForm teamSettingsData={teamSettings} />
              </Suspense>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-12 w-[500px] bg-slate-800" />}>
            <h1 className="text-2xl font-semibold">{myTeamInfo.name}</h1>
          </Suspense>
        </div>
      </div>
      <div className="grow p-4">
        <DataTable columns={teamColumns} data={data} />
      </div>
    </main>
  );
}
