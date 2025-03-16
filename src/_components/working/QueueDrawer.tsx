"use client";

import { Button } from "../ui/button";
import { 
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "../ui/drawer";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";
import { QueueDataTable } from "./QueueDataTable";

export function QueueDrawer() {

  return (
      <Drawer>
        <DrawerTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Queue</span>
            </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Queue</DrawerTitle>
            <DrawerDescription>
              Manage your queue
            </DrawerDescription>
          </DrawerHeader>
          <div className="fixed p-4 bottom-0 left-0 w-full">
            <div className="flex flex-col w-full">
              <Button className="flex w-full justify-center text-lg font-bold">
                Queue
              </Button>
                <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
                  <div className="w-full overflow-hidden">
                      <QueueDataTable />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  );
}