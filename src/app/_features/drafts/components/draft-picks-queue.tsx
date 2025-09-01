'use client';
// import React & Nextjs
import { use } from "react";

// import UI
import { Avatar, AvatarImage, AvatarFallback } from "~/_components/ui/avatar";

// import Server Actions

// import Types
import { type QueueDraftPick } from "~/app/_features/drafts/utils/draft";


export default function DraftQueueList({
  draftQueue,
}: {
  draftQueue: Promise<QueueDraftPick[]>;
}) {
  const allPicks = use(draftQueue);
  // Add useActionState to determine on the clock
  
  return (
  <div className="flex grow">
    <ul className="flex">
      {allPicks.map((pick) => (
        <li key={pick.draft_pick.id} className="flex p-2 items-center gap-2">
          <p>{pick.draft_pick.pickNumber}:</p>
          <Avatar className="w-7 h-7">
            <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
            <AvatarFallback className="text-black text-xs">{pick.team.abbreviation}</AvatarFallback>
          </Avatar>
          <p className="text-s">{pick.team.name}</p>
          {/* Add On the Clock Option */}
        </li>
      ))} 
    </ul>
  </div>
  )
}