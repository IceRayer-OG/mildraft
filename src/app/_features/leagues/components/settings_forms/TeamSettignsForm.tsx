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

// Actions
import { updateTeamSettingsAction } from "../../actions/leagueActions";

// Types
import { type TeamSettings, type LeagueData } from "../../utils/settings";


export function TeamSettingsForm({
  teamSettingsData,
  leagueSettingsData,
}: {
  teamSettingsData: TeamSettings;
  leagueSettingsData: LeagueData;
}) {
  const updateTeamSettingsActionBind = updateTeamSettingsAction.bind(
    null,
    leagueSettingsData,
  );

  const [content, updateLeagueTeamSettings, isPending] = useActionState(
    updateTeamSettingsActionBind,
    { status: "", message: "", data: teamSettingsData },
  );

  useEffect(() => {
    if (content.status === "success") {
      toast.success(content.message);
    } else if (content.status === "error") {
      toast.error(content.message);
    }
  }, [content]);

  return (
    <Form action={updateLeagueTeamSettings}>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <Label>Logos Enabled</Label>
          <Checkbox
            id="team-logo-enabled"
            name="teamLogosEnabled"
            defaultChecked={content?.data.logoEnabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Teams Allowed</Label>
          <Input
            type="number"
            id="team-allowed"
            name="teamsAllowed"
            min={8}
            max={12}
            defaultValue={content?.data.teamsAllowed}
            className="w-20"
          />
        </div>
      </div>
      <CardFooter className="flex justify-end gap-2 p-4">
        {isPending ? (
          <Button variant="outline" disabled>
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
