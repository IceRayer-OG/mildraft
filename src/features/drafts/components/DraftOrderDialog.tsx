"use client";
// React imports
import { use, useState } from "react";

// UI imports
import { Button } from "~/_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogFooter,
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
import { type Team } from "~/features/team/utils/team";
import { addNewDraftPickAction } from "../actions/draftActions";
import { toast } from "sonner";

async function addNewDraftPick(teamName: string) {
  try {
    await addNewDraftPickAction(teamName);
    toast.success("Pick Added");
  } catch (error) {
    console.log(error);
    toast.error("Failed to add pick");
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <LucideSettings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="justify-self-center">Draft Order</DialogTitle>
        <DraftOrderList draftOrderList={draftOrderList} />
        <DialogFooter>
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
              addNewDraftPick(selectedTeam);
            }}
          >
            Add Pick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
