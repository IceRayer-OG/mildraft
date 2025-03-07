import "server-only";
import { db } from "./db";

export async function getAllPosts() {
  const myPlayers = await db.query.players.findMany();
  return myPlayers;
}