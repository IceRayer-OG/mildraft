"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { 
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "./ui/drawer";

export function QueueDrawer() {
  const [isOpen, setIsOpen] = useState(false);

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
          <DrawerClose />
          <DrawerFooter>
            <Button variant="outline">Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  );
}