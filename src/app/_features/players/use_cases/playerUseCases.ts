"use server";

// React & Next
import { auth } from "@clerk/nextjs/server";
import * as XLSX from 'xlsx';

// Import Types
import { type Players } from "../utils/players";

// Import Database Queries
import { getFreeAgents, loadDraftablePlayers } from "../database/queries";

async function checkAuthorization() {
    const user = await auth();
    if (!user.userId) {
        throw new Error("Not logged in");
    }
    return user;
}

export async function getFreeAgentsUseCase(): Promise<Players[]> {
    const user = await checkAuthorization();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    
    const freeAgents = await getFreeAgents();
    
    return freeAgents as Players[];
}

export async function loadDraftablePlayersUseCase(loadFile: File) {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  // Here you would add logic to read the file and load players into the database
  const draftablePlayerFile = loadFile;
  if (!draftablePlayerFile) throw new Error("No file uploaded");

  // 1. Convert File to Buffer
  const bytes = await draftablePlayerFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Parse Excel
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("No sheets found in the Excel file");
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("No sheet data found");
  
  // 3. Convert to JSON
  // header: 1 returns an array of arrays; default returns objects using the first row as keys
  const data = XLSX.utils.sheet_to_json(sheet);
  // For demonstration, we'll just log the file name

  // await loadDraftablePlayers(data);

  console.log("Loading draftable players from file:", loadFile.name);

  // Simulate successful loading
  return true;
}