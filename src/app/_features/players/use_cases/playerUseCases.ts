"use server";

// React & Next
import { auth } from "@clerk/nextjs/server";
import * as XLSX from 'xlsx';

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

  // 1. Convert File to Buffer
  const bytes = await draftablePlayerFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Parse Excel
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    response.status = "error";
    response.message = "No sheets found in the Excel file";
    return response;
  }
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    response.status = "error";
    response.message = "No sheet data found";
    return response;
  }
  
  
  // 3. Convert to JSON
  // header: 1 returns an array of arrays; default returns objects using the first row as keys
  const rawData = XLSX.utils.sheet_to_json(sheet);
  if (rawData.length === 0) {
    response.status = "error";
    response.message = "Sheet is empty";
    return response;
  }

	console.log("Raw Data:", rawData);

	const dataToInsert = rawData.map((row: any) => {
      // Logic to split "6' 2\" / 210 lbs" into two variables
      const rawHeightWeight = String(row['Height / Weight'] || '');
      const [h, w] = rawHeightWeight.split('/').map(s => s.trim());
			// Mapping logic for Weight
			// 1. w.replace(/\D/g, '') removes " lbs" or any other text
			// 2. parseInt converts the remaining "210" string to a number
			const numericWeight = w ? parseInt(w.replace(/\D/g, ''), 10) : null;
			const positionsPlayed = String(row['Position'] || '').split('/').map(s => s.trim()).filter(Boolean);

			return {
        rank: Number(row['Rank']) || null,
        playerName: String(row['Player'] || ''),
        position: positionsPlayed as ProPlayers['position'],
        team: String(row['Team'] || ''),
        level: String(row['Level'] || ''),
        eta: String(row['eta'] || ''),
        age: Number(row['Age']) || null,
        height: String(h || ''),
        weight: numericWeight || null,
        bats: (row['Bats'] || '') as "R" | "L" | "B" | "S",
        throws: (row['Throws'] || '') as "R" | "L" | "B" | "S",
      } as ProPlayers;
	});
 
  
	// For demonstration, we'll just log the file name
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