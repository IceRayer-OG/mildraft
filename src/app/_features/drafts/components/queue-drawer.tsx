// React and Next.js imports
import { Suspense, use } from "react";
import { ListOrdered, X } from "lucide-react";

// UI Components
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/_components/ui/drawer";
import { Button } from "~/_components/ui/button";
import { Badge } from "~/_components/ui/badge";
import { QueueDataTable } from "../components/queue-dataTable";
import { AutoDraftControl } from "./AutoDraftControl";

// Server Actions
import {
  getMyQueueAction,
  getMyAutoDraftSettingsAction,
} from "../actions/queueActions";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function QueueDrawer() {
  const data = use(getMyQueueAction());
  const autoDraftSettings = use(getMyAutoDraftSettingsAction());

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-1.5 text-stone-200 hover:text-white cursor-pointer">
          <span>Queue</span>
          {autoDraftSettings.autoDraftEnabled && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6 pt-2 max-h-[88vh] flex flex-col gap-3 bg-slate-950/95 border-t border-white/15 backdrop-blur-2xl text-white shadow-2xl">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mb-1 shrink-0" />
        
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 grow overflow-hidden">
          <DrawerHeader className="pb-0 pt-1 text-center">
            <DrawerTitle className="flex items-center justify-center gap-2 text-xl font-bold text-white tracking-tight">
              <ListOrdered className="size-5 text-sky-400" />
              <span>Prospect Queue</span>
              <Badge variant="outline" className="border-white/15 bg-white/5 text-stone-300 font-mono text-xs">
                {data?.length ?? 0}
              </Badge>
            </DrawerTitle>
            <DrawerDescription className="text-xs text-stone-400 mt-0.5">
              Drag and drop prospects to prioritize your auto-draft selection order.
            </DrawerDescription>
          </DrawerHeader>

          {/* Auto-Draft Quick Settings Bar */}
          <AutoDraftControl
            initialEnabled={autoDraftSettings.autoDraftEnabled}
            initialMode={autoDraftSettings.autoDraftMode}
            queueCount={data?.length ?? autoDraftSettings.queueCount}
          />

          <ScrollArea className="overflow-y-auto grow pr-1">
            <Suspense fallback={<div className="p-8 text-center text-sm text-stone-400">Loading queue...</div>}>
              <QueueDataTable data={data} />
            </Suspense>
          </ScrollArea>

          <DrawerFooter className="p-0 pt-1 flex flex-row justify-end">
            <DrawerClose asChild>
              <Button variant="outline" size="sm" className="border-white/15 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer gap-1.5">
                <X className="size-3.5" />
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
