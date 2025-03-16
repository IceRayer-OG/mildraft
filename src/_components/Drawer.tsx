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
import { DataTable } from "./data-table";
import { queueColumns } from "./QueueColumns";
import { type Players } from "~/utils/players";
import { getMyQueue } from "~/server/queries";

async function getMyQueueData(): Promise<Players[]> {
  // Fetch data from your API here.
  const myQueueData = await getMyQueue() as Players[];
  return myQueueData;
}

export async function DrawerExample() {

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
  
