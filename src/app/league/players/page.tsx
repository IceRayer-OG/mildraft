import { Suspense, use } from "react";
// UI Components
import { PlayerDataTable } from "~/features/players/components/player-data-table";
import { playerColumns } from "~/features/players/components/player-columns";

// Server Actions
import { getFreeAgentsAction } from "~/features/players/actions/playerActions";
 
export default function PlayerPage() {
  const data = use(getFreeAgentsAction());
 
  return (
    <main className="flex flex-col min-h-screen w-full items-center p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="grow w-full">
            <Suspense fallback={<div>...Loading</div>}>
              <PlayerDataTable columns={playerColumns} data={data} />
            </Suspense>
        </div>
    </main>
  )
}