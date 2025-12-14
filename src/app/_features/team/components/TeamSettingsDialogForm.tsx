"use client";
// React
import { useActionState, useEffect, use } from "react";
import Form from "next/form";
import { PopoverClose } from "@radix-ui/react-popover";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { toast } from "sonner";

// Actions
import {
  updateTeamSettingsAction,
  // getTeamSettingsAction
} from "../actions/teamSettingsActions";

// Utils
import { type TeamSettings } from "../utils/team";


export function TeamSettingsDialogForm({
  teamSettingsData,
}: {
  teamSettingsData: Promise<TeamSettings>;
}) {
  // useActionState
  const [content, updateTeamSettings, isPending] = useActionState(
    updateTeamSettingsAction,
    { status: "", message: "", data: use(teamSettingsData) },
  );

  useEffect(() => { 
    if (content.status === "success") {
      toast.success(content.message);
    } else if (content.status === "error") {
      toast.error(content.message);
    }
  }, [content]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-center">
          <DialogTitle>Team Settings</DialogTitle>
          <DialogDescription>Settings for the Team.</DialogDescription>
        </DialogHeader>
        <Form action={updateTeamSettings}>
          <div className="flex-col gap-4 space-y-2">
            <div className="flex items-center justify-between space-y-1">
              <Label>Team Name</Label>
              <Input
                id="team-name"
                name="teamName"
                required
                defaultValue={content?.data.teamName}
                placeholder="Enter team name"
                className="text-right"
              />
              {content?.status === "error" && (
                <p id="team-name-error" className="text-sm text-red-500">
                  {content.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between space-y-1">
              <Label>Team Abbreviation</Label>
              <Input
                id="team-abbrviation"
                name="teamAbbreviation"
                required
                defaultValue={content?.data.teamAbbreviation}
                placeholder="Enter team abbreviation"
                className="text-right"
              />
              {content?.status === "error" && (
                <p
                  id="team-abbreviation-error"
                  className="text-sm text-red-500"
                >
                  {content.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between space-y-1">
              <Label>Team Logo</Label>
              <Input
                id="team-logo"
                name="teamLogo"
                defaultValue={content?.data.teamLogo}
                placeholder="Enter team Logo URL"
                className="text-right"
              />
              {content?.status === "error" && (
                <p
                  id="team-abbreviation-error"
                  className="text-sm text-red-500"
                >
                  {content.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-3">
            {isPending ? (
              <Button type="submit" variant="outline" disabled>
                Saving...
              </Button>
            ) : (
              <Button type="submit" variant="outline">
                Save
              </Button>
            )}
            <DialogClose asChild>
              <PopoverClose asChild>
                {content.status === "success" ? (
                    <Button variant="destructive">Close</Button>
                ) : (
                    <Button variant="destructive">Cancel</Button>
                )} 
              </PopoverClose>             
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
