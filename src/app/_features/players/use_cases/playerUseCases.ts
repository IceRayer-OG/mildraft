"use server";

// Node & React
import { Readable } from "stream";
import { auth } from "@clerk/nextjs/server";
import ExcelJS from "exceljs";

// Import Types
import { type Players, type ProPlayers } from "../utils/players";

// Import Database Queries
import { getFreeAgents, loadProspectPlayers } from "../database/queries";

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

export async function loadProspectPlayersUseCase(loadFile: File) {
  const user = await checkAuthorization();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const response = {
    status: "",
    message: "",
  };

  // Here you would add logic to read the file and load players into the database
  const draftablePlayerFile = loadFile;
  if (!draftablePlayerFile) {
    response.status = "error";
    response.message = "No file uploaded";
    return response;
  }

  // 1. Convert File to Stream
  const bytes = await draftablePlayerFile.arrayBuffer();
  const stream = Readable.from(Buffer.from(bytes));

  // 2. Parse Excel
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.read(stream);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    response.status = "error";
    response.message = "No sheets found in the Excel file";
    return response;
  }

  // 3. Convert to JSON
  const headers: string[] = [];
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = String(cell.value ?? "").trim();
  });

  const rawData: Record<string, unknown>[] = [];
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    const rowObj: Record<string, unknown> = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (header) {
        rowObj[header] = cell.value;
      }
    });
    rawData.push(rowObj);
  });

  if (rawData.length === 0) {
    response.status = "error";
    response.message = "Sheet is empty";
    return response;
  }

  console.log("Raw Data:", rawData);

  const dataToInsert = rawData.map((row) => {
      // Logic to split "6' 2\" / 210 lbs" into two variables
      const rawHeightWeight = String(row['Height / Weight'] ?? '');
      const rawEta = String(row['eta'] ?? '').trim();
      const numberedETA = (rawEta === '-' || rawEta === '') ? null : rawEta;
      const [h, w] = rawHeightWeight.split('/').map(s => s.trim());
			// Mapping logic for Weight
			// 1. w.replace(/\D/g, '') removes " lbs" or any other text
			// 2. parseInt converts the remaining "210" string to a number
			const numericWeight = w ? parseInt(w.replace(/\D/g, ''), 10) : null;
			const positionsPlayed = String(row['Position'] ?? '').split('/').map(s => s.trim()).filter(Boolean);

			return {
        rank: Number(row['Top 100 Rank']) || null,
        teamRank: Number(row['Team Rank']) || null,
        draftRank: Number(row['Draft Rank']) || null,
        playerName: String(row['Player'] ?? ''),
        position: positionsPlayed as ProPlayers['position'],
        team: String(row['Team'] ?? ''),
        level: String(row['Level'] ?? ''),
        eta: numberedETA,
        age: Number(row['Age']) || null,
        height: String(h ?? ''),
        weight: numericWeight || null,
        bats: (row['Bats'] ?? '') as "R" | "L" | "B" | "S",
        throws: (row['Throws'] ?? '') as "R" | "L" | "B" | "S",
      } as ProPlayers;
	});
 
  
	// For debugging, we'll console log the info to load
	// console.log("Data to insert:", dataToInsert);
  // console.log("Loading prospect players from file:", loadFile.name);

	// 4. Load Data into Database
	try {
		await loadProspectPlayers(dataToInsert);
		response.status = "success";
		response.message = "Prospect players loaded successfully";
	} catch (error) {
		response.status = "error";
		response.message = "Error loading prospect players into database";
		console.error("Error loading prospect players:", error);
	}

  return response;
}