import { Players, columns } from "./columns"
import { DataTable } from "~/_components/data-table"
 
async function getData(): Promise<Players[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      playerName: "Inigo Montoya",
      position: "1B",
      dlStatus: "Inactive",
    },
    // ...
  ]
}
 
export default async function DemoPage() {
  const data = await getData()
 
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    </main>
  )
}