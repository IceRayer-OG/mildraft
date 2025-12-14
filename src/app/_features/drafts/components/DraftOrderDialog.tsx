"use client";
// React imports
import { use, useState } from "react";

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
// import { TeamSelectList } from "~/features/team/components/TeamSelectList";

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
    console.log(error);
    toast.error("Failed to add pick");
  } finally{
  }
}

export function DraftOrderDialog({
  draftOrderList,
  leagueTeams,
}: {
  draftOrderList: Promise<QueueDraftPick[]>;
  leagueTeams: Promise<Team[]>;
}) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const allTeams = use(leagueTeams);

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <LucideSettings />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-h-3/4">
          <DialogHeader>
            <DialogTitle className="text-center">Draft Order</DialogTitle>
            <DialogDescription className="text-center">
              Manage the draft order for your league.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] overflow-y-hidden">
            <DraftOrderList draftOrderList={draftOrderList} />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Select
              value={selectedTeam}
              onValueChange={(value) => {
                setSelectedTeam(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                {allTeams.map((leagueTeam) => (
                  <SelectItem key={leagueTeam.id} value={leagueTeam.name}>
                    {leagueTeam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={"default"}
              onClick={() => {
                addNewDraftPick(selectedTeam).catch(Error);
              }}
            >
              Add Pick
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
