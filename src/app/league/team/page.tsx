// Data types
import { type teamPlayers } from "~/features/players/utils/players";

// React
import { Suspense } from "react";

// UI Elements
import { 
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/_components/ui/avatar";
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
import { dbGetMyTeam, dbGetMyTeamName } from "~/features/team/actions/teamActions";

async function getData(): Promise<teamPlayers[]> {
  // Fetch data
  const players = await dbGetMyTeam() as teamPlayers[];
  return players;
}
 
export default async function TeamPage() {
  const data = await getData()
  const myTeamName = dbGetMyTeamName();
 
  return (
    <main className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="flex justify-start items-center gap-4">
          <div>
            <Popover>
              <PopoverTrigger className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
                  <AvatarFallback className="text-black">SV</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <TeamSettingsForm />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Suspense fallback={<Skeleton className="h-12 w-[500px] bg-slate-800" />}>
              <h1 className="text-2xl font-semibold">{myTeamName}</h1>
            </Suspense>
          </div>
        </div>
        <div className="grow p-4">
          <DataTable columns={teamColumns} data={data} />
        </div>
    </main>
  )
}