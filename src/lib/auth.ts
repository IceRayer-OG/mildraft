import "server-only";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Returns true if the currently authenticated Clerk user has commissioner: true in their publicMetadata.
 */
export async function isCommissionerUser(): Promise<boolean> {
  const user = await currentUser();
  return Boolean(user?.publicMetadata?.commissioner);
}

/**
 * Enforces commissioner privileges. Throws an Error if unauthenticated or not a commissioner.
 */
export async function checkCommissionerAuthorization() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be logged in.");
  }
  if (!user.publicMetadata?.commissioner) {
    throw new Error("Forbidden: Commissioner privileges required.");
  }
  return user;
}
