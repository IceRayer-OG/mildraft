"use client";

import { use } from "react";
import { type UnclaimedTeam } from "../utils/team";
import { Button } from "~/_components/ui/button";
import { toast } from "sonner";

// Server Action
import { claimTeamAction } from "../actions/teamActions";


async function claimTeam(leagueTeam: UnclaimedTeam) {
  const response = await claimTeamAction(leagueTeam);
  if (response.status === "success") {
    toast.error(`${response.message}`);
  } else {
    toast.error(`Failed to claim ${leagueTeam.name}`);
  }
}


export default function ClaimTeamList({
  teamList,
}: {
  teamList: Promise<UnclaimedTeam[]>;
}) {
  const allTeams = use(teamList);
  // const claimedTeam[error, claimTeamStateAction] = useActionState(claimTeamActionTest, "");  

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
