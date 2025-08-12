import { Button } from "~/_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "~/_components/ui/dialog";
import { LucideSettings } from "lucide-react";
import DraftOrderList from "./DraftOrderList";
import { type QueueDraftPick } from "../utils/draft";
import { TeamSelectList } from "~/features/team/components/TeamSelectList";
import { Team } from "~/features/team/utils/team";

export function DraftOrderDialog(
    {draftOrderList, leagueTeams}: {draftOrderList: Promise<QueueDraftPick[]>, leagueTeams: Promise<Team[]>}
) {
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
          <TeamSelectList teamList={leagueTeams} />
          <Button variant={"default"}>Add Pick</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
