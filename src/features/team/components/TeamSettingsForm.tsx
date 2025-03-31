"use client";

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
import { Input } from "~/_components/ui/input";


export function TeamSettingsForm() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary">Settings</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Team Settings</DialogTitle>
                <DialogDescription>
                    Settings for the Team.
                </DialogDescription>
            </DialogHeader>
            <Input placeholder="Team Name" />
            <Input placeholder="Team Abbreviation" />
            <Input placeholder="Team Logo" />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" variant="outline">Save</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}