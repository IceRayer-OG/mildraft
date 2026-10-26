"use client";

import { useState, useTransition } from "react";
import { Zap, Shield, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Switch } from "~/_components/ui/switch";
import { Badge } from "~/_components/ui/badge";
import { toast } from "sonner";
import { updateMyAutoDraftSettingsAction } from "../actions/queueActions";

interface AutoDraftControlProps {
  initialEnabled: boolean;
  initialMode: "instant" | "safety_net";
  queueCount: number;
}

export function AutoDraftControl({
  initialEnabled,
  initialMode,
  queueCount,
}: AutoDraftControlProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [mode, setMode] = useState<"instant" | "safety_net">(initialMode);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    startTransition(async () => {
      try {
        const result = await updateMyAutoDraftSettingsAction({
          enabled: checked,
          mode,
        });

        if (checked) {
          if (result.immediatePick?.status === "Success") {
            toast.success("Auto-Draft Pick Executed!", {
              description: result.immediatePick.message,
            });
          } else {
            toast.success("Auto-Draft Enabled", {
              description:
                mode === "instant"
                  ? "Top queued player will be drafted ~10s after turn starts."
                  : "Normal timer will run; top queued player drafted on timeout.",
            });
          }
        } else {
          toast.info("Auto-Draft Disabled", {
            description: "You will draft all picks manually.",
          });
        }
      } catch (error) {
        setEnabled(!checked); // rollback
        toast.error("Failed to update auto-draft settings");
        console.error(error);
      }
    });
  };

  const handleModeChange = (newMode: "instant" | "safety_net") => {
    if (newMode === mode) return;
    setMode(newMode);
    if (!enabled) return;

    startTransition(async () => {
      try {
        await updateMyAutoDraftSettingsAction({
          enabled: true,
          mode: newMode,
        });
        toast.success(
          newMode === "instant"
            ? "Mode: Instant Pick (Active)"
            : "Mode: Safety Net (Passive)",
        );
      } catch (error) {
        setMode(mode); // rollback
        toast.error("Failed to update auto-draft mode");
        console.error(error);
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-lg border border-white/10 bg-slate-900/80 p-3 shadow-md backdrop-blur-md">
      {/* Top row: Toggle + Queue Health */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Switch
            id="queue-auto-draft-switch"
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isPending}
            className="data-[state=checked]:bg-emerald-600"
          />
          <label
            htmlFor="queue-auto-draft-switch"
            className="flex items-center gap-1.5 text-sm font-semibold text-white cursor-pointer select-none"
          >
            <span>Auto-Draft</span>
            {isPending && <Loader2 className="size-3.5 animate-spin text-stone-400" />}
          </label>
        </div>

        {/* Queue health badge */}
        <div className="flex items-center gap-2">
          {queueCount > 0 ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium"
            >
              <CheckCircle2 className="size-3 mr-1 text-emerald-400" />
              {queueCount} in Queue
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium"
            >
              <AlertTriangle className="size-3 mr-1 text-amber-400" />
              Queue Empty
            </Badge>
          )}
        </div>
      </div>

      {/* Mode selection row */}
      {enabled && (
        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-stone-400">Execution Mode:</span>
          <div className="flex rounded-md bg-slate-950/80 p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => handleModeChange("instant")}
              disabled={isPending}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors text-xs font-medium ${
                mode === "instant"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Zap className="size-3" />
              Instant Pick
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("safety_net")}
              disabled={isPending}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors text-xs font-medium ${
                mode === "safety_net"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Shield className="size-3" />
              Safety Net
            </button>
          </div>
        </div>
      )}

      {/* Helpful context helper text */}
      <div className="mt-1.5 text-[11px] text-stone-400">
        {!enabled ? (
          <span>Turn on to automatically draft your top-ranked queued players when on the clock.</span>
        ) : mode === "instant" ? (
          <span>Picks top queued prospect ~10s after turn starts to keep the draft moving fast.</span>
        ) : (
          <span>Your full clock runs normally; top queued prospect is auto-picked only if clock expires.</span>
        )}
      </div>
    </div>
  );
}
