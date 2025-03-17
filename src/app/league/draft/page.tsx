import { draftColumns } from "./columns";
import { DataTable } from "~/_components/data-table";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { getDraftPlayers} from "~/server/queries";
import { type DraftPlayers } from "~/utils/players";
import { QueueDrawer } from "~/_components/Drawer";

export const dynamic = "force-dynamic";

async function getPlayerData(): Promise<DraftPlayers[]> {
  // Fetch data from your API here.
  const draftablePlayers = await getDraftPlayers() as DraftPlayers[];
  return draftablePlayers;
}

export default async function DraftPage() {
  const data = await getPlayerData();

  return (
    <main className="flex flex-col justify-between w-full min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div>
        <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
          <div className="w-full overflow-hidden">
              <DataTable columns={draftColumns} data={data} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex justify-center w-full">
        <div className="fixed bottom-0 size-16">
          <QueueDrawer />
        </div>
      </div>
    </main>
  )
}
