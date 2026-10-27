"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";

export interface DraftOption {
  id: number;
  draftYear: number | null;
  status: string;
}

interface DraftYearSelectProps {
  drafts: DraftOption[];
  selectedDraftId: number;
}

export function DraftYearSelect({
  drafts,
  selectedDraftId,
}: DraftYearSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (newDraftId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("draftId", newDraftId);
    router.push(`/league?${params.toString()}`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return " (Active)";
      case "completed":
        return " (Completed)";
      case "setup":
        return " (Setup)";
      default:
        return "";
    }
  };

  return (
    <Select value={String(selectedDraftId)} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] sm:w-[220px] h-9 bg-black/40 border-white/15 text-white text-xs sm:text-sm font-medium shadow-sm focus:ring-sky-500">
        <SelectValue placeholder="Select draft results" />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-white/15 text-white">
        {drafts.map((draft) => {
          const year = draft.draftYear ?? draft.id;
          const statusBadge = getStatusLabel(draft.status);
          return (
            <SelectItem
              key={draft.id}
              value={String(draft.id)}
              className="text-xs sm:text-sm hover:bg-white/10 cursor-pointer text-stone-200 focus:bg-white/15 focus:text-white"
            >
              {year} Draft{statusBadge}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
