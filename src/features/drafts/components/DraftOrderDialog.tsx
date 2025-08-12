
import { Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "~/_components/ui/form";
import { Label } from "~/_components/ui/label";
import { Button } from "~/_components/ui/button";
import { Dialog,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogContent,
    DialogFooter
} from "~/_components/ui/dialog";
import { LucideSettings } from "lucide-react";
import DraftOrderList from "./DraftOrderList";
import { type QueueDraftPick } from "../utils/draft";

export function DraftOrderDialog({draftOrderList,
}: {
  draftOrderList: Promise<QueueDraftPick[]>;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"}>
                    <LucideSettings />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="justify-self-center">Draft Order</DialogTitle>
                <DraftOrderList draftOrderList={draftOrderList} />
            </DialogContent>

        </Dialog>
    )
}