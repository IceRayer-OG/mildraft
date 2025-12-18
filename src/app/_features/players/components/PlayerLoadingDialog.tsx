"use client";

// Import React
import { useState } from "react";
import Form from "next/form";

// Import UI Components
import { CheckSquare, LoaderIcon, LucideSettings, Upload } from "lucide-react";
import { Button } from "~/_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogPortal,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogHeader,
} from "~/_components/ui/dialog";
import { Label } from "~/_components/ui/label";

// Functions
export function PlayerLoadingDialog() {
  const [content, setContent] = useState({ status: "pending" });

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <LucideSettings />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogPortal>
        <DialogContent className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg">
          <Form action={async () => {}}>
            <DialogHeader>
              <DialogTitle>Load Draftable MiL Players</DialogTitle>
              <DialogDescription>
                Please select the excel used to load Top 100 prospect players.
              </DialogDescription>
            </DialogHeader>
            <div className="flex p-3">
              <div className="pb-4">
                <Label htmlFor="excelFile" className="mb-2 block">
                  Upload Excel or CSV File
                </Label>
                <input
                  type="file"
                  name="excelFile"
                  accept=".xlsx, .xls, .csv"
                  className="block border-2"
                />

              </div>
            </div>

            <DialogFooter>
              {content.status === "loading" ? (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setContent({ status: "loaded" })}
                >
                  <LoaderIcon className="animate-spin" />
                </Button>
              ) : content.status === "loaded" ? (
                <Button
                  variant="outline"
                  type="reset"
                  onClick={() => setContent({ status: "pending" })}
                >
                  <CheckSquare color="green" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  type="submit"
                  onClick={() => setContent({ status: "loading" })}
                >
                  <Upload />
                </Button>
              )}
            </DialogFooter>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
