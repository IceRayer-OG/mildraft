import { Suspense, use } from "react";
import { History, X } from "lucide-react";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Badge } from "~/_components/ui/badge";
import { DraftPickTable } from "./pick-history-data-table";

// Server Actions
import { getCompleteDraftPicksAction } from "../actions/draftActions";

export function DraftHistoryDialog({ draftId }: { draftId?: number }) {
  const completedPickInfo = use(getCompleteDraftPicksAction(draftId));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-1.5 text-stone-200 hover:text-white cursor-pointer">
          <History className="size-4 text-stone-400" />
          <span>History</span>
          {completedPickInfo && completedPickInfo.length > 0 && (
            <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-stone-300">
              {completedPickInfo.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-w-3xl w-full max-h-[85vh] bg-slate-950/95 border border-white/15 backdrop-blur-2xl text-white shadow-2xl p-5 flex flex-col gap-4">
        <DialogHeader className="pb-1 text-left">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <History className="size-5 text-sky-400" />
              <span>Draft Pick History</span>
              <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-300 font-mono text-xs">
                {completedPickInfo?.length ?? 0} {completedPickInfo?.length === 1 ? "Pick" : "Picks"}
              </Badge>
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-stone-400 mt-0.5">
            Chronological record of completed selections in this draft season.
          </DialogDescription>
        </DialogHeader>

        <div className="grow overflow-y-auto pr-1">
          <Suspense fallback={<div className="p-8 text-center text-sm text-stone-400">Loading history...</div>}>
            <DraftPickTable data={completedPickInfo} draftId={draftId} />
          </Suspense>
        </div>

        <DialogFooter className="pt-2 border-t border-white/10 flex flex-row justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer gap-1.5"
            >
              <X className="size-3.5" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
