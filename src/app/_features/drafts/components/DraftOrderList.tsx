"use client";

import { use } from "react";
import { Button } from "~/_components/ui/button";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";


// Types
import { type QueueDraftPick } from "../utils/draft";

// Server Action

export default function DraftOrderList({
  draftOrderList,
}: {
  draftOrderList: Promise<QueueDraftPick[]>;
}) {
  const draftPicks = draftOrderList;

  return (
    <div className="flex grow overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap overflow-y-auto">
        <ul className="flex grow flex-col gap-2">
          {use(draftPicks).map((draftPick) => (
            <li key={draftPick.draft_pick.id} className="flex items-center gap-6">
              <Button>Edit</Button>
              <p>{draftPick.draft_pick.pickNumber}</p>
              <p>{draftPick.team.name}</p>
            </li>
          ))}
        </ul>
        <Scrollbar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}