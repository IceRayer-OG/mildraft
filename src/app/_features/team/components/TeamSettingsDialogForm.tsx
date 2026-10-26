"use client";
// React
import { useActionState, useEffect } from "react";
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
import { Checkbox } from "~/_components/ui/checkbox";
import { Separator } from "~/_components/ui/separator";
import { RadioGroup, RadioGroupItem } from "~/_components/ui/radio-group";

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
  teamSettingsData: TeamSettings;
}) {
  const [content, updateTeamSettings, isPending] = useActionState(
    updateTeamSettingsAction,
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
                disabled={true} // Disable the input for now since logo updates aren't implemented
                className="text-right"
              />
              {content?.status === "error" && (
                <p
                  id="team-logo-error"
                  className="text-sm text-red-500"
                >
                  {content.message}
                </p>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-center">Draft Settings</h2>
            </div>
            <Separator className="border"/>
            <div className="flex items-center justify-between space-y-1">
              <Label htmlFor="auto-draft-enabled">Auto Draft</Label>
              <Checkbox
                id="auto-draft-enabled"
                name="autoDraftEnabled"
                defaultChecked={content?.data.autoDraftEnabled}
              />
              {content?.status === "error" && (
                <p
                  id="auto-draft-error"
                  className="text-sm text-red-500"
                >
                  {content.message}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs text-stone-300 font-medium">Auto-Draft Mode</Label>
              <RadioGroup
                name="autoDraftMode"
                defaultValue={content?.data.autoDraftMode ?? "instant"}
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex items-start space-x-2 rounded-md border border-white/10 p-2.5 bg-white/5">
                  <RadioGroupItem value="instant" id="mode-instant" className="mt-0.5" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="mode-instant" className="font-medium text-xs cursor-pointer">
                      ⚡ Instant Pick
                    </Label>
                    <p className="text-[11px] text-stone-400">
                      Drafts top queued player ~10s after turn starts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 rounded-md border border-white/10 p-2.5 bg-white/5">
                  <RadioGroupItem value="safety_net" id="mode-safety-net" className="mt-0.5" />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor="mode-safety-net" className="font-medium text-xs cursor-pointer">
                      🛡️ Safety Net
                    </Label>
                    <p className="text-[11px] text-stone-400">
                      Full clock runs; drafts top queued player only on timeout.
                    </p>
                  </div>
                </div>
              </RadioGroup>
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
                  <Button variant="destructive" type="reset">Close</Button>
                ) : (
                  <Button variant="destructive" type="reset">Cancel</Button>
                )}
              </PopoverClose>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
