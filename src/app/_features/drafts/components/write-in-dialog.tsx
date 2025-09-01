"use client";

import Form from "next/form";

// React Components
import { useEffect, useActionState } from "react";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";

// Server Actions
import { draftWriteInPlayerAction } from "../actions/draftActions";
import { toast } from "sonner";
import { Label } from "~/_components/ui/label";

export function WriteInDialog() {
  const [content, draftWriteIn, isPending] = useActionState(
    draftWriteInPlayerAction,
    { status: "", message: "" },
  );

  useEffect(() => {
    if (content.status === "Success") {
      toast.success(content.message);
    } else if (content.status === "Error") {
      toast.error(content.message);
    }
  }, [content]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Write-In</Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle className="flex justify-center">Write-In</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <Form action={draftWriteIn}>
          <Label>Player Name</Label>
          <Input
            id="write-in-player-name"
            name="writeInPlayerName"
            defaultValue={""}
          />

          <DialogFooter className="mt-2 gap-4">
            <DialogClose asChild>
              <Button variant="default" type="submit">
                Submit
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" type="button">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
