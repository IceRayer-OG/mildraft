"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Players = {
  id: string
  playerName: string
  position: "C" | "1B" | "2B" | "3V" | "SS" | "RF" | "CF" | "LF" | "P"
  dlStatus: "Active" | "Inactive"
}
 
export const columns: ColumnDef<Players>[] = [
  {
    accessorKey: "playerName",
    header: "Player Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "dlStatus",
    header: "DL Eligble",
  },
]