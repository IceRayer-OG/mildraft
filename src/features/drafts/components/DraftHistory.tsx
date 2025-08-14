// UI Components
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { ScrollArea } from "~/_components/ui/scroll-area";
import { DraftPickTable } from "./pick-history-data-table";
import { draftPickColumns } from "./pick-history-columns";

// Server Actions
import { getCompleteDraftPicksAction } from "../actions/draftActions";

export async function DraftHistoryDialog() {
    const completedPickInfo = await getCompleteDraftPicksAction();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">History</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="justify-self-center">Draft History</DialogTitle>
                <ScrollArea>
                    <p>Here are the recent picks</p>
                </ScrollArea>
                <DraftPickTable columns={draftPickColumns} data={completedPickInfo} />
                {/* <DialogClose asChild>
                    <Button variant={"outline"}>Close</Button>
                </DialogClose> */}
            </DialogContent>
        </Dialog>
    );
}
