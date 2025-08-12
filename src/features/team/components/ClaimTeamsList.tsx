"use client";

import { use } from "react";
import { type Team } from "../utils/team";
import { Button } from "~/_components/ui/button";
import { toast } from "sonner";

// Server Action
import { claimTeamAction } from "../actions/teamActions"


function claimTeam(leagueTeam: Team) {
  try {
    claimTeamAction(leagueTeam.id)
    toast.success(`${leagueTeam.name} claimed successfully`)
  } catch(error) {
    toast.error(`Failed to claim ${leagueTeam.name}`)
    throw new Error("Claim Failed")
  }
}

export default function ClaimTeamList({
  teamList,
}: {
  teamList: Promise<Team[]>;
}) {
  const allTeams = use(teamList);
  return (
    <div className="flex grow">
      <ul className="flex grow flex-col gap-2">
        {allTeams.map((leagueTeam) => (
          <li key={leagueTeam.id} className="flex items-center gap-4">
            <Button onClick={()=>claimTeam(leagueTeam)}>Claim</Button>
            <p>{leagueTeam.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
