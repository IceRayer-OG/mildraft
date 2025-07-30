

import { getFreeAgents } from "~/server/queries";
import { type Players} from "~/features/players/utils/players";
import { PlayerDataTable } from "~/features/players/components/player-data-table";
import { playerColumns } from "~/features/players/components/player-columns";
 
async function getData(): Promise<Players[]> {
  // Fetch data from your API here
  const freeAgents = await getFreeAgents() as Players[];

  return freeAgents;

  // Placeholder data for demonstration purposes
  // return [
  //   {
  //     id: 5,
  //     playerName: "Luke Skywalker",
  //     position: "P",
  //     team: "Milwaukee Brewers",
  //     throws: "R",
  //     bats: "R",
  //   },
  // ]
}
 
export default async function PlayerPage() {
  const data = await getData()
 
  return (
    <main className="flex flex-col min-h-screen w-full items-center p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="grow w-full">
            <PlayerDataTable columns={playerColumns} data={data} />
        </div>
    </main>
  )
}