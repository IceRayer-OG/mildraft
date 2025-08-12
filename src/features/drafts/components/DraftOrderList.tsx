"use client";

import { use } from "react";
import { Button } from "~/_components/ui/button";

// Types
import { type QueueDraftPick } from "../utils/draft";

// Server Action


export default function DraftOrderList({
  draftOrderList,
}: {
  draftOrderList: Promise<QueueDraftPick[]>;
}) {
  const draftPicks = use(draftOrderList);
  
  return (
    <div className="flex grow">
      <ul className="flex grow flex-col gap-2">
        {draftPicks.map((draftPick) => (
          <li key={draftPick.draft_pick.id} className="flex items-center gap-6">
            <Button>Edit</Button>
            <p>{draftPick.draft_pick.pickNumber}</p>
            <p>{draftPick.team.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}