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
import { DataTable } from "../../../_components/data-table";
import { queueColumns } from "./queue-columns";

// Types
import { type QueuePlayers } from "../utils/draft";

// Server Actions
import { getMyQueueAction } from "../actions/queueActions";


async function getMyQueueData(): Promise<QueuePlayers[]> {
  // Fetch data from your API here.
  const myQueueData = await getMyQueueAction() as QueuePlayers[];
  return myQueueData;
}

export async function QueueDrawer() {

    const data = await getMyQueueData();

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
  
