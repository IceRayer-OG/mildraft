import { type teamPlayers } from "~/utils/players";

import { teamColumns } from "~/features/team/components/team-columns";
import { DataTable } from "~/features/team/components/team-data-table";
import { dbGetMyTeam } from "~/features/team/database/teamActions";

async function getData(): Promise<teamPlayers[]> {
  // Fetch data from your API here.
  const players = await dbGetMyTeam() as teamPlayers[];
  return players;
}
 
export default async function DemoPage() {
  const data = await getData()
 
  return (
    <main className="flex min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="grow p-4">
            <DataTable columns={teamColumns} data={data} />
        </div>
    </main>
  )
}