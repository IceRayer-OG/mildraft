import { columns } from "~/features/players/components/player-columns";
import { DataTable } from "~/features/players/components/player-data-table";
import { type Players } from "~/utils/players"; 
async function getData(): Promise<Players[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      playerName: "Inigo Montoya",
      position: "P",
      team: "Florida Marlins",
      throws: "R",
      bats: "R",
    },
    // ...
  ]
}
 
export default async function DemoPage() {
  const data = await getData()
 
  return (
    <main className="flex min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="grow p-4">
            <DataTable columns={columns} data={data} />
        </div>
    </main>
  )
}