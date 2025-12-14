import { Suspense } from "react";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { DraftPickTable } from "./pick-history-data-table";
import { draftPickColumns } from "./pick-history-columns";

// Server Actions
import { getCompleteDraftPicksAction } from "../actions/draftActions";

export function DraftHistoryDialog() {
  const completedPickInfo = getCompleteDraftPicksAction();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">History</Button>
      </DialogTrigger>
      <DialogContent className="max-h-3/4">
        <DialogTitle className="justify-self-center">Draft History</DialogTitle>
        <p className="place-content-start">Here are the recent picks</p>
        <ScrollArea className="overflow-y-hidden">
          <Suspense fallback={<div className="h-full w-full">Loading...</div>}>
            <DraftPickTable columns={draftPickColumns} data={completedPickInfo} />
          </Suspense>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        {/* <DialogClose asChild>
                <Button variant={"outline-solid"}>Close</Button>
            </DialogClose> */}
      </DialogContent>
    </Dialog>
  );
}
