import { Suspense, use } from "react";

// UI Components
import { PlayerDataTable } from "~/app/_features/players/components/player-data-table";

// Server Actions
import { getFreeAgentsAction } from "~/app/_features/players/actions/playerActions";
import { TeamsTableLoading } from "~/app/_features/team/components/TeamsLoading";

export const dynamic = 'force-dynamic';

export default function PlayerPage() {
  const data = use(getFreeAgentsAction());

  return (
    <div className="flex flex-col min-h-screen w-full items-center p-3 sm:p-4 pb-12 text-white">
      <div className="grow w-full max-w-7xl">
        <Suspense fallback={<TeamsTableLoading />}>
          <PlayerDataTable data={data} />
        </Suspense>
      </div>
    </div>
  );
}