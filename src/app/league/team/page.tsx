// React
import { Suspense, use } from "react";

// UI Elements
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "~/_components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/_components/ui/popover";
import { Skeleton } from "~/_components/ui/skeleton";
import { TeamsTableLoading } from "~/app/_features/team/components/TeamsLoading";

// Components
import { teamColumns } from "~/app/_features/team/components/team-columns";
import { DataTable } from "~/app/_features/team/components/team-data-table";
import { TeamSettingsDialogForm } from "~/app/_features/team/components/TeamSettingsDialogForm";

// Actions
import {
  getMyTeamAction,
  getMyTeamInfoAction,
} from "~/app/_features/team/actions/teamActions";
import { getTeamSettingsAction } from "~/app/_features/team/actions/teamSettingsActions";


export default function TeamPage() {
  const data = getMyTeamAction();
  const teamSettings = getTeamSettingsAction();
  const myTeamInfo = getMyTeamInfoAction();

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-[#12026d] to-[#15162c] p-4 text-white">
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
                <TeamSettingsDialogForm teamSettingsData={teamSettings} />
              </Suspense>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-12 w-[300px] bg-slate-800" />}>
            <h1 className="text-2xl font-semibold">{use(myTeamInfo).name}</h1>
          </Suspense>
        </div>
      </div>
      <div className="grow p-4">
        <Suspense fallback={<TeamsTableLoading />}>
          <DataTable columns={teamColumns} data={data} />
        </Suspense>
      </div>
    </main>
  );
}
