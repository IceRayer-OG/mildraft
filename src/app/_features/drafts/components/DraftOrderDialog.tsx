"use client";

// React imports
import { useState } from "react";

// UI imports
import { Button } from "~/_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogPortal,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogHeader,
} from "~/_components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/_components/ui/select";
import { LucideSettings } from "lucide-react";
import DraftOrderList from "./DraftOrderList";

// type imports
import { type QueueDraftPick } from "../utils/draft";
import { type Team } from "~/app/_features/team/utils/team";
import { addNewDraftPickAction } from "../actions/draftActions";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";

async function addNewDraftPick(teamName: string) {
  try {
    const pickAdded = await addNewDraftPickAction(teamName);
    toast.success(`Pick Added for ${pickAdded}`);
  } catch (error) {
    console.error(error);
    toast.error("Failed to add pick");
  }
}

export function DraftOrderDialog({
  draftOrderList,
  leagueTeams,
  isCompleted = false,
}: {
  draftOrderList: QueueDraftPick[];
  leagueTeams: Team[];
  isCompleted?: boolean;
}) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const allTeams = leagueTeams;

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size="icon" className="hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer">
          <LucideSettings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
        <DialogContent className="max-h-3/4 bg-slate-950 border border-white/15 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Draft Order {isCompleted && "(Completed)"}
            </DialogTitle>
            <DialogDescription className="text-center text-stone-400 text-xs">
              {isCompleted
                ? "The active draft has completed. Draft order is finalized."
                : "Manage the draft order for your league."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-75 overflow-y-hidden">
            <DraftOrderList draftOrderList={draftOrderList} isCompleted={isCompleted} />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          {!isCompleted && (
            <DialogFooter className="gap-2">
              <Select
                value={selectedTeam}
                onValueChange={(value) => {
                  setSelectedTeam(value);
                }}
              >
                <SelectTrigger className="bg-black/40 border-white/15 text-white">
                  <SelectValue placeholder="Select team to add" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/15 text-white">
                  {allTeams.map((leagueTeam) => (
                    <SelectItem
                      key={leagueTeam.id}
                      value={leagueTeam.name}
                      className="hover:bg-white/10 cursor-pointer"
                    >
                      {leagueTeam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={"default"}
                onClick={() => {
                  if (!selectedTeam) {
                    toast.error("Please select a team");
                    return;
                  }
                  addNewDraftPick(selectedTeam).catch(console.error);
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
              >
                Add Pick
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
