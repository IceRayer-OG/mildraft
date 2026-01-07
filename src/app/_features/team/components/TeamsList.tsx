"use client";

import { use } from "react";
import { type Team } from "../utils/team";
import { Avatar, AvatarImage,AvatarFallback } from "~/_components/ui/avatar";

export default function TeamList({
    teamList,
    }: {
    teamList: Promise<Team[]>;
    }) {
    const allTeams = use(teamList);
    
    return (
        <div className="flex grow">
            <ul className="flex flex-col gap-2">
                {allTeams.map((leagueTeam) => (
                <li key={leagueTeam.id} className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
                        <AvatarFallback className="bg-white text-black">{leagueTeam.abbreviation}</AvatarFallback>
                    </Avatar>
                    <p>{leagueTeam.name}</p>
                </li>
                ))} 
            </ul>
        </div>
    )
}