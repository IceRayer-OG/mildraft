import { type Players, columns } from "./columns";
import { DataTable } from "~/_components/data-table";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { getDraftPlayers } from "~/server/queries";

async function getData(): Promise<Players[]> {
  // Fetch data from your API here.
  const apiData = await getDraftPlayers();

  return apiData;
}

export default async function DraftPage() {
  const data = await getData()

  return (
    <main className="flex-col justify-between w-full min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
        <div className="w-full overflow-hidden">
            <DataTable columns={columns} data={data} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
        <div className="w-full overflow-hidden">
            <DataTable columns={columns} data={data} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  )
}
