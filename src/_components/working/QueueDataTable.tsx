import { DataTable } from "../data-table";
import { getMyQueue } from "~/server/queries";
import { type Players } from "~/utils/players";
import { queueColumns } from "../QueueColumns";

async function getMyQueueData(): Promise<Players[]> {
  // Fetch data from your API here.
  const myQueueData = await getMyQueue() as Players[];
  return myQueueData;
}

export async function QueueDataTable() {
  const myQueueData = await getMyQueueData();

  return (
    <DataTable columns={queueColumns} data={myQueueData} />
  );
}