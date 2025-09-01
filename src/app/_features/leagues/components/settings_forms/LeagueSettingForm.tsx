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

// Actions
import { updateLeagueSettingsAction } from "../../actions/leagueActions";

// Types
import { type LeagueSettings, type LeagueData } from "../../utils/settings";
import { DialogClose } from "~/_components/ui/dialog";

export function LeagueSettingsForm({
  leagueSettingsData,
  leagueDetailsData,
}: {
  leagueSettingsData: LeagueSettings;
  leagueDetailsData: LeagueData;
}) {
  const updateLeagueSettingsActionBind = updateLeagueSettingsAction.bind(
    null,
    leagueDetailsData,
  );
  const [content, updateLeagueSettings, isPending] = useActionState(
    updateLeagueSettingsActionBind,
    { status: "", message: "", data: leagueSettingsData },
  );

  useEffect(() => {
    if (content.status === "success") {
      toast.success(content.message);
    } else if (content.status === "error") {
      toast.error(content.message);
    }
  }, [content]);

  return (
    <Form action={updateLeagueSettings}>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <Label>League Name</Label>
          <Input
            type="text"
            id="league-name"
            name="leagueName"
            defaultValue={content?.data.name}
            className="w-[250px] text-right"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Abbreviation</Label>
          <Input
            type="text"
            id="league-abbreviation"
            name="leagueAbbreviation"
            maxLength={4}
            defaultValue={content?.data.abbreviation}
            className="w-[250px] text-right"
          />
        </div>
        <CardFooter className="flex justify-end gap-2 p-4">
          {isPending ? (
            <Button variant="outline" type="submit" disabled>
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
      </div>
    </Form>
  );
}
