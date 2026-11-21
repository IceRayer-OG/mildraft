"use client";

import Form from "next/form";

// React Components
import { useState, useEffect, useActionState } from "react";

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
import { Loader2 } from "lucide-react";

// Server Actions
import { draftWriteInPlayerAction } from "../actions/draftActions";
import { toast } from "sonner";
import { Label } from "~/_components/ui/label";

export function WriteInDialog() {
  const [open, setOpen] = useState(false);
  const [content, draftWriteIn, isPending] = useActionState(
    draftWriteInPlayerAction,
    { status: "", message: "" },
  );

  useEffect(() => {
    if (content.status === "Success") {
      toast.success(content.message);
      setOpen(false);
    } else if (content.status === "Error") {
      toast.error(content.message);
    }
  }, [content]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-stone-200 hover:text-white cursor-pointer">
          Write-In
        </Button>
      </DialogTrigger>
      <DialogContent className="p-5 max-w-sm sm:max-w-md bg-slate-950 border border-white/20 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">Write-In Selection</DialogTitle>
          <DialogDescription className="text-xs text-stone-400 text-center">
            Enter the player&apos;s full name (First & Last) if they do not appear in the draft pool.
          </DialogDescription>
        </DialogHeader>

        <Form action={draftWriteIn} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="write-in-player-name" className="text-xs text-stone-300">
              Player Name
            </Label>
            <Input
              id="write-in-player-name"
              name="writeInPlayerName"
              placeholder="e.g. John Doe"
              required
              className="bg-white/5 border-white/15 text-white placeholder:text-stone-500"
            />
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="border-white/20 bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="default"
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer min-w-[80px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Submitting...
                </>
              ) : (
                "Submit Pick"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
