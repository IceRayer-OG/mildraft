'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { 
  Upload, 
  Loader2, 
  CheckSquare, 
  Settings as LucideSettings, 
  AlertCircle,
  RefreshCw,
  Globe,
  FileSpreadsheet
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/_components/ui/tabs";

import { loadProspectPlayersAction, syncProspectsAction } from '../actions/playerActions';
import { toast } from 'sonner';

const initialUploadState = {
  status: '',
  message: '',
};

export function PlayerLoadingDialog() {
  const [open, setOpen] = useState(false);
  const [uploadState, formAction, isUploadPending] = useActionState(
    loadProspectPlayersAction,
    initialUploadState,
  );
  const [inputKey, setInputKey] = useState(Date.now());

  // MLB Sync state
  const [syncYear, setSyncYear] = useState<number>(new Date().getFullYear());
  const [isSyncPending, startSyncTransition] = useTransition();

  useEffect(() => {
    if (uploadState.status === "success") {
      toast.success("Prospect players loaded successfully!");
      setInputKey(Date.now());
    } else if (uploadState.status === "error") {
      toast.error(uploadState.message || "Error loading players.");
    }
  }, [uploadState]);

  const handleMlbSync = () => {
    startSyncTransition(async () => {
      try {
        const res = await syncProspectsAction(syncYear);
        if (res.status === "success") {
          toast.success(res.message);
          setOpen(false);
        } else {
          toast.error(res.message || "Failed to sync prospects from MLB.");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Sync error");
      }
    });
  };

  return (
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size="icon" title="Prospect Management & Sync">
          <LucideSettings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
        <DialogContent className="fixed top-1/2 left-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-xl bg-background border">
          <DialogHeader className="mb-2">
            <DialogTitle>Prospect Ingestion & Sync</DialogTitle>
            <DialogDescription>
              Sync live rankings and career eligibility from MLB Pipeline or upload a custom spreadsheet.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="mlb-sync" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mlb-sync" className="flex items-center gap-1.5 text-xs">
                <Globe className="size-3.5" />
                MLB Pipeline Sync
              </TabsTrigger>
              <TabsTrigger value="manual-upload" className="flex items-center gap-1.5 text-xs">
                <FileSpreadsheet className="size-3.5" />
                Custom CSV / Excel
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: DIRECT MLB PIPELINE SYNC */}
            <TabsContent value="mlb-sync" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="syncYear">Prospect Class / Draft Year</Label>
                <Input
                  id="syncYear"
                  type="number"
                  min={2020}
                  max={2030}
                  value={syncYear}
                  onChange={(e) => setSyncYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
                  disabled={isSyncPending}
                  className="w-full"
                />
              </div>

              <div className="rounded-md border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <CheckSquare className="size-3.5 text-sky-400" />
                  What this automated sync does:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Fetches Top 100, all 30 Team Top 30s, Draft & International lists (~1,000 players).</li>
                  <li>Hydrates career MLB At Bats and Innings Pitched from MLB Stats API.</li>
                  <li>Calculates MiL eligibility based on league rules (&le;130 AB and &le;50.0 IP).</li>
                  <li>Safely upserts by canonical MLBAM ID without duplicate conflicts.</li>
                </ul>
              </div>

              <DialogFooter className="mt-4 pt-2">
                <Button
                  onClick={handleMlbSync}
                  disabled={isSyncPending}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white"
                >
                  {isSyncPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing ~1,000 Prospects & Stats...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync {syncYear} Prospects from MLB
                    </>
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>

            {/* TAB 2: MANUAL CSV / EXCEL UPLOAD */}
            <TabsContent value="manual-upload" className="space-y-4 pt-3">
              <form action={formAction}>
                <div className="grid w-full items-center gap-1.5 py-2">
                  <Label htmlFor="excelFile">Upload Excel or CSV File</Label>
                  <Input 
                    key={inputKey}
                    id="excelFile" 
                    name="excelFile" 
                    type="file" 
                    accept=".xlsx, .xls, .csv"
                    disabled={isUploadPending}
                    required
                    className="cursor-pointer"
                  />
                  {uploadState.status === "error" && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {uploadState.message}
                    </p>
                  )}
                </div>

                <DialogFooter className="mt-4 pt-2">
                  {isUploadPending ? (
                    <Button disabled variant="outline" className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing File...
                    </Button>
                  ) : uploadState.status === "success" ? (
                    <Button 
                      type="submit"
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Upload Again
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Process
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
