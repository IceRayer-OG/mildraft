"use client";

import { useState, useTransition } from "react";
import { Zap, Shield, AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
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
    <div className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-xl">
      {/* Top row: Toggle + Status + Queue Health */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Switch
            id="queue-auto-draft-switch"
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isPending}
            className="data-[state=checked]:bg-emerald-500 cursor-pointer shadow-sm"
          />
          <label
            htmlFor="queue-auto-draft-switch"
            className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer select-none"
          >
            <span>Auto-Draft</span>
            {enabled ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            ) : (
              <span className="text-[11px] font-normal text-stone-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                Off
              </span>
            )}
            {isPending && <Loader2 className="size-3.5 animate-spin text-stone-400" />}
          </label>
        </div>

        {/* Queue health badge */}
        <div className="flex items-center gap-2">
          {queueCount > 0 ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5"
            >
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>{queueCount} {queueCount === 1 ? "player" : "players"} in queue</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium px-2.5 py-1 flex items-center gap-1.5"
            >
              <AlertTriangle className="size-3.5 text-amber-400" />
              <span>Queue Empty</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Mode selection row */}
      {enabled && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <span className="text-stone-300 font-medium flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-sky-400" />
            Execution Mode:
          </span>
          <div className="flex rounded-lg bg-slate-950/90 p-1 border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => handleModeChange("instant")}
              disabled={isPending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold cursor-pointer ${
                mode === "instant"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Zap className="size-3.5" />
              Instant Pick
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("safety_net")}
              disabled={isPending}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold cursor-pointer ${
                mode === "safety_net"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield className="size-3.5" />
              Safety Net
            </button>
          </div>
        </div>
      )}

      {/* Context helper text */}
      <div className="mt-2 text-[11px] text-stone-400 leading-relaxed">
        {!enabled ? (
          <span>Enable Auto-Draft to automatically select your top-ranked queued prospects when you go on the clock.</span>
        ) : mode === "instant" ? (
          <span>⚡ <strong className="text-stone-300">Instant Mode:</strong> Your top queued player is auto-drafted ~10s after your turn starts.</span>
        ) : (
          <span>🛡️ <strong className="text-stone-300">Safety Net:</strong> Your regular clock runs normally. Top queued player is only drafted if your timer expires.</span>
        )}
      </div>
    </div>
  );
}
