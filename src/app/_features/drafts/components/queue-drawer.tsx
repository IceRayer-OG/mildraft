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

// Server Actions
import { getMyQueueAction } from "../actions/queueActions";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function QueueDrawer() {
  const data = use(getMyQueueAction());

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost">Queue</Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 max-h-7/8">
        <DrawerHeader>
          <DrawerTitle className="flex justify-center">
            Player Queue
          </DrawerTitle>
          <DrawerDescription className="sr-only" />
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <Suspense>
            <QueueDataTable data={data} />
          </Suspense>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
