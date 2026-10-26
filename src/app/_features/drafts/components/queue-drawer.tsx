// React and Next.js imports
import { Suspense, use } from "react";

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
        <Button variant="ghost" className="relative flex items-center gap-1.5">
          <span>Queue</span>
          {autoDraftSettings.autoDraftEnabled && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 max-h-7/8 flex flex-col gap-3">
        <DrawerHeader className="pb-1">
          <DrawerTitle className="flex justify-center text-lg font-bold">
            Player Queue
          </DrawerTitle>
          <DrawerDescription className="sr-only" />
        </DrawerHeader>

        {/* Auto-Draft Quick Settings Bar */}
        <AutoDraftControl
          initialEnabled={autoDraftSettings.autoDraftEnabled}
          initialMode={autoDraftSettings.autoDraftMode}
          queueCount={data?.length ?? autoDraftSettings.queueCount}
        />

        <ScrollArea className="overflow-y-auto grow">
          <Suspense>
            <QueueDataTable data={data} />
          </Suspense>
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
