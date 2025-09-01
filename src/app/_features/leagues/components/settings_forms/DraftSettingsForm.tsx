"use client";

import Form from "next/form";

// React and NextJS Imports
import { useActionState, useEffect } from "react";

// UI Components
import { Button } from "~/_components/ui/button";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { toast } from "sonner";
import { CardFooter } from "~/_components/ui/card";
import { Checkbox } from "~/_components/ui/checkbox";
import { DialogClose } from "~/_components/ui/dialog";
import { DatePicker } from "~/_components/DatePicker";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { Separator } from "~/_components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/_components/ui/tooltip";

// Actions
import { updateDraftSettingsAction } from "../../actions/leagueActions";

// Types
import { type DraftSettings, type LeagueData } from "../../utils/settings";

export const experimental_ppr = true

export function DraftSettingsForm({
  draftSettingsData,
  leagueSettingsData,
}: {
  draftSettingsData: DraftSettings;
  leagueSettingsData: LeagueData;
}) {
  const updateDraftSettingsActionBind = updateDraftSettingsAction.bind(
    null,
    leagueSettingsData,
  );

  const [content, updateLeagueDraftSettings, isPending] = useActionState(
    updateDraftSettingsActionBind,
    { status: "", message: "", data: draftSettingsData },
  );

  useEffect(() => {
    if (content.status === "success") {
      toast.success(content.message);
    } else if (content.status === "error") {
      toast.error(content.message);
    }
  }, [content]);

  return (
    <Form action={updateLeagueDraftSettings}>
      <Separator />
      <ScrollArea className="h-[200px] w-full whitespace-nowrap">
        <div className="flex flex-col gap-2 overflow-y-hidden p-4">
          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Label>Draft Enabled</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enbale your League&apos;s Draft</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Checkbox
              id="draft-enabled"
              name="draftEnabled"
              defaultChecked={content?.data.draftEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Snake Draft</Label>
            <Checkbox
              id="snake-draft"
              name="snakeDraft"
              defaultChecked={content?.data.snakeDraft}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Draft Date</Label>
            <Input
              id="draft-start-date"
              name="draftStartDate"
              type="date"
              defaultValue={content?.data.draftStart}
              className="w-[250px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Draft Time</Label>
            <Input
              id="draft-start-time"
              name="draftStartTime"
              type="time"
              defaultValue={content?.data.draftTime}
              className="w-[250px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pick Duration (hours)</Label>
            <Input
              id="pick-duration"
              name="pickDuration"
              type="number"
              defaultValue={content?.data.pickDuration}
              className="w-[100px]"
            />
          </div>
          <Separator />

          <p className="text-center">
            Overnight Pause <span className="text-red-500">-WIP-</span>
          </p>

          <Separator />
          <div className="flex items-center justify-between">
            <Label>Pause Enabled</Label>
            <Checkbox
              id="draft-pause-enabled"
              name="draftPauseEnabled"
              defaultChecked={content?.data.draftPauseEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pause Start Time</Label>
            <Input
              id="draft-pause-start-time"
              name="draftPauseStartTime"
              type="time"
              defaultValue={content?.data.draftPauseStartTime}
              className="w-[250px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pause End Time</Label>
            <Input
              id="draft-pause-end-time"
              name="draftPauseEndTime"
              type="time"
              defaultValue={content?.data.draftPauseEndTime}
              className="w-[250px] text-right"
            />
          </div>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <CardFooter className="flex justify-end space-x-2">
        {isPending ? (
          <Button variant="outline" type="submit">
            Saving...
          </Button>
        ) : (
          <Button variant="outline" type="submit">
            Save
          </Button>
        )}
        <DialogClose asChild>
          {content.status === "success" ? (
            <Button variant="destructive" type="reset">
              Close
            </Button>
          ) : (
            <Button variant="destructive" type="reset">
              Cancel
            </Button>
          )}
        </DialogClose>
      </CardFooter>
    </Form>
  );
}
