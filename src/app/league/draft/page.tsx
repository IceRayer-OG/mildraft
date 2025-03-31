// React and Next.js imports
import { Suspense } from "react";
// Queries
import { getDraftPlayers} from "~/server/queries";
// Utilities and type definitions
import { type DraftPlayers } from "~/utils/players";
// Global UI components
import { Separator } from "~/_components/ui/separator";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
// Feature components
import { WriteInDialog } from "~/features/drafts/components/write-in-dialog";
import { QueueDrawer } from "~/features/drafts/components/queue-drawer";
import { draftColumns } from "~/features/drafts/components/draft-columns";
import { DataTable } from "~/features/drafts/components/draft-data-table";

export const dynamic = "force-dynamic";

async function getPlayerData(): Promise<DraftPlayers[]> {
  // Data fetch
  const draftablePlayers = await getDraftPlayers() as DraftPlayers[];
  return draftablePlayers;
}

export default async function DraftPage() {
  const data = await getPlayerData();

  return (
    <main className="flex flex-col w-full min-h-screen gap-4 p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex border p-2 rounded-md">
        <div className="justify-start pr-2">
          <p className="grow content-center">Picks</p>
          <Separator />
          <div className="flex items-center p-2 gap-2">
            <p className="font-semibold">Clock: </p>
            <p>4:00:00</p>
          </div>
        </div>
        <div className="flex grow justify-evenly items-center">
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
      <div>
        <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
          <div className="w-full overflow-hidden">
            <Suspense fallback={<div className="w-full h-full">Loading...</div>}>
              <DataTable columns={draftColumns} data={data} />
            </Suspense>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex fixed bottom-0 gap-4 justify-center w-full">
        <div className=" pb-8">
          <QueueDrawer />
        </div>
        <div>
          <WriteInDialog />
        </div>
      </div>
    </main>
  )
}
