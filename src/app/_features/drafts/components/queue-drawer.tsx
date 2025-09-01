// React and Next.js imports
import { use } from "react";

// UI Components
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/_components/ui/drawer";
import { Button } from "~/_components/ui/button";
import { DataTable } from "../../../../_components/data-table";
import { queueColumns } from "./queue-columns";

// Server Actions
import { getMyQueueAction } from "../actions/queueActions";


export function QueueDrawer() {

    const data = use(getMyQueueAction());

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost">Queue</Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
                <DrawerHeader>
                    <DrawerTitle className="flex justify-center">Player Queue</DrawerTitle>
                </DrawerHeader>
                <DataTable columns={queueColumns} data={data} />
            <DrawerFooter>
                <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                </DrawerClose>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
  
