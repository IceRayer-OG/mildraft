"use client";

import { Suspense, use } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import ClaimTeamList from "./ClaimTeamsList";
import { type UnclaimedTeam } from "../utils/team";


export function ClaimTeamDialog({unclaimedLeagueTeams,}:{unclaimedLeagueTeams: Promise<UnclaimedTeam[]>}) {
  
  
	return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Claim Your Team</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="justify-self-center">Claim Your Team</DialogTitle>
        <Suspense fallback={<div>Loading...</div>}>
				  <ClaimTeamList teamList={unclaimedLeagueTeams} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
