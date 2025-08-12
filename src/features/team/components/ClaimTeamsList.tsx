"use client";

import { use } from "react";
import { type UnclaimedTeam } from "../utils/team";
import { Button } from "~/_components/ui/button";
import { toast } from "sonner";

// Server Action
import { claimTeamAction } from "../actions/teamActions";

async function claimTeam(leagueTeam: UnclaimedTeam) {
  try {
    const teamClaimed = await claimTeamAction(leagueTeam.id);
    if (teamClaimed) {
      toast.success(`${leagueTeam.name} claimed successfully`);
    }
  } catch (error) {
    toast.error(`Failed to claim ${leagueTeam.name}`);
    throw new Error("Claim Failed");
  } finally {
  }
}

export default function ClaimTeamList({
  teamList,
}: {
  teamList: Promise<UnclaimedTeam[]>;
}) {
  const allTeams = use(teamList);
  return (
    <div className="flex grow">
      <ul className="flex grow flex-col gap-2">
        {allTeams.map((leagueTeam) => (
          <li key={leagueTeam.id} className="flex items-center gap-4">
            <Button onClick={() => claimTeam(leagueTeam)}>Claim</Button>
            <p>{leagueTeam.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
