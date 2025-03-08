"use client"
 
import { type ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Players = {
  id: string
  playerName: string
  position: "C" | "1B" | "2B" | "3V" | "SS" | "RF" | "CF" | "LF" | "P"
  team: string
  age: number
  height: string
  weight: number
  throws: "R" | "L" | "B"
  bats: "R" | "L" | "B"
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
    accessorKey: "team", 
    header: "Team" 
  },
  {
    accessorKey: "dlStatus",
    header: "DL Eligble",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "height",
    header: "Height",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    accessorKey: "throws",
    header: "Throws",
  },
  {
    accessorKey: "bats",
    header: "Bats",
  },
]