import { type Players, columns } from "./columns"
import { DataTable } from "~/_components/data-table"
 
async function getData(): Promise<Players[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52t",
      playerName: "Luke Skywalker",
      position: "P",
      team: "Milwaukee Brewers",
      age: 25,
      height: "5' 10''",
      weight: 170,
      throws: "R",
      bats: "R",
    },
    // ...
  ]
}
 
export default async function DemoPage() {
  const data = await getData()
 
  return (
    <main className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    </main>
  )
}