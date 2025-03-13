import { type Players, draftColumns, queueColumns } from "./columns";
import { DataTable } from "~/_components/data-table";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { getDraftPlayers, getMyQueue } from "~/server/queries";
import { Button } from "~/_components/ui/button";

export const dynamic = "force-dynamic";

async function getPlayerData(): Promise<Players[]> {
  // Fetch data from your API here.
  const draftablePlayers = await getDraftPlayers() as Players[];
  return draftablePlayers;
}

async function getMyQueueData(): Promise<Players[]> {
  // Fetch data from your API here.
  const myQueueData = await getMyQueue() as Players[];
  return myQueueData;
}

export default async function DraftPage() {
  const data = await getPlayerData();
  const myQueueData = await getMyQueueData();

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
          <Button className="flex w-full justify-center text-lg font-bold">
            Queue
          </Button>
          <div className="hidden">
            <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
              <div className="w-full overflow-hidden">
                  <DataTable columns={queueColumns} data={myQueueData} />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </main>
  )
}
