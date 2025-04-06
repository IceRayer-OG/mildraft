'use client';

import { type QueueDraftPick } from "~/utils/draft";
import { use } from "react";

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
        <li key={pick.draft_pick.id} className="flex p-2 gap-2">
          <p>{pick.draft_pick.pickNumber}: {pick.team.name}</p>
        </li>
      ))} 
    </ul>
  </div>
  )
}