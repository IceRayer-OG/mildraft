"use client"

import { use, useState } from "react";

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
  const [selectedTeam, setSelectedTeam] = useState("")

  return (
    <Select value={selectedTeam} onValueChange={(value) =>{setSelectedTeam(value)}}>
      <SelectTrigger >
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
