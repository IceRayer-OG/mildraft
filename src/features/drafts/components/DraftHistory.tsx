import { Suspense, use } from "react";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { ScrollArea } from "~/_components/ui/scroll-area";
import { DraftPickTable } from "./pick-history-data-table";
import { draftPickColumns } from "./pick-history-columns";

// Server Actions
import { getCompleteDraftPicksAction } from "../actions/draftActions";

export function DraftHistoryDialog() {
    const completedPickInfo = use(getCompleteDraftPicksAction());

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">History</Button>
            </DialogTrigger>
            <DialogContent className="max-h-3/4 md:max-h-1/2 lg:max-h-1/3">
                <DialogTitle className="justify-self-center">Draft History</DialogTitle>
                <p className="place-content-start">Here are the recent picks</p>
                <ScrollArea>
                    <Suspense fallback={<div className="w-full h-full">Loading...</div>}>
                        <DraftPickTable columns={draftPickColumns} data={completedPickInfo} />
                    </Suspense>
                </ScrollArea>
                {/* <DialogClose asChild>
                    <Button variant={"outline"}>Close</Button>
                </DialogClose> */}
            </DialogContent>
        </Dialog>
    );
}
