'use client';

import { type QueueDraftPick } from "~/features/drafts/utils/draft";
import { use } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "~/_components/ui/avatar";

export default function DraftQueueList({
  draftQueue,
}: {
  draftQueue: Promise<QueueDraftPick[]>;
}) {
  const allPicks = use(draftQueue);
  
  return (
  <div className="flex grow">
    <ul className="flex">
      {allPicks.map((pick) => (
        <li key={pick.draft_pick.id} className="flex p-2 items-center gap-2">
          <p>{pick.draft_pick.pickNumber}:</p>
          <Avatar>
            <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
            <AvatarFallback className="text-black">{pick.team.abbreviation}</AvatarFallback>
          </Avatar>
          <p>{pick.team.name}</p>
        </li>
      ))} 
    </ul>
  </div>
  )
}