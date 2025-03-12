import { type Players, draftColumns, queueColumns } from "./columns";
import { DataTable } from "~/_components/data-table";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { getDraftPlayers } from "~/server/queries";

export const dynamic = "force-dynamic";

async function getData(): Promise<Players[]> {
  // Fetch data from your API here.
  const res = await getDraftPlayers() as Players[];
  return res;
}

export default async function DraftPage() {
  const data = await getData();

  return (
    <main className="flex flex-col justify-between w-full min-h-lvh p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div>
        <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
          <div className="w-full overflow-hidden">
              <DataTable columns={draftColumns} data={data} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="fixed p-4 bottom-0 left-0 w-full">
        <div className="flex flex-col w-full">
          <div className="flex w-full justify-center text-lg font-bold">
            Queue
          </div>
          <div>
            <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
              <div className="w-full overflow-hidden">
                  <DataTable columns={queueColumns} data={data} />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </main>
  )
}
