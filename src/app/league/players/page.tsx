import { Suspense, use } from "react";

// UI Components
import { PlayerDataTable } from "~/app/_features/players/components/player-data-table";

// Server Actions
import { getFreeAgentsAction } from "~/app/_features/players/actions/playerActions";
import { TeamsTableLoading } from "~/app/_features/team/components/TeamsLoading";

export const dynamic = 'force-dynamic'
 
export default function PlayerPage() {
  const data = use(getFreeAgentsAction());
 
  return (
    <main className="flex flex-col min-h-screen w-full items-center p-4 bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="grow w-full">
            <Suspense fallback={<TeamsTableLoading />}>
              <PlayerDataTable data={data} />
            </Suspense>
        </div>
    </main>
  )
}