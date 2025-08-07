import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { ScrollArea } from "~/_components/ui/scroll-area";

// import { getDraftedPlayersAction } from 

export async function DraftHistoryDialog() {
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
                {/* <DialogClose asChild>
                    <Button variant={"outline"}>Close</Button>
                </DialogClose> */}
            </DialogContent>
        </Dialog>
    );
}
