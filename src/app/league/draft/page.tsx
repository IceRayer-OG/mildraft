import { type Players, columns } from "./columns";
import { DataTable } from "~/_components/data-table";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";

async function getData(): Promise<Players[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52t",
      playerName: "Wyatt Earp",
      position: "P",
      team: "Texas Rangers",
      age: 30,
      height: "6' 1''",
      weight: 180,
      throws: "R",
      bats: "R",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <main className="flex w-full min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
        <div className="w-full overflow-hidden">
            <DataTable columns={columns} data={data} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  )
}
