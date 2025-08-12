import { use } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
	SelectItem,
} from "~/_components/ui/select";

import { type Team } from "../utils/team";

export function TeamSelectList({ teamList }: { teamList: Promise<Team[]> }) {
	const allTeams = use(teamList);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Team" />
      </SelectTrigger>
      <SelectContent>
				{allTeams.map((leagueTeam) => (
					<SelectItem key={leagueTeam.id} value={leagueTeam.name}>{leagueTeam.name}</SelectItem>
				))}
			</SelectContent>
    </Select>
  );
}
