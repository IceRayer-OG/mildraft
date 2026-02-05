// utils/date-utils.ts
import { cookies } from "next/headers";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

export async function formatToUserTimezone(
  date: Date | string | null | undefined,
) {
  if (!date) return { dateStr: "", timeStr: "" };

  const cookieStore = await cookies();
  const timezone = cookieStore.get("user-timezone")?.value || "UTC";

  const d = typeof date === "string" ? new Date(date) : date;

  const dateStr = d.toLocaleDateString("en-CA", { timeZone: timezone }); // YYYY-MM-DD
  const timeStr = d.toLocaleTimeString("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return { dateStr, timeStr };
}

export async function convertToUTC(
  dateStr: string,
  timeStr: string,
): Promise<Date> {
  const timezone = "America/Los_Angeles"; // Replace with league timezone if needed
  console.log("Converting to UTC from timezone:", timezone);

  const localDateTime = `${dateStr.split("T")[0]}T${timeStr.length === 5 ? timeStr + ":00" : timeStr}`;

  const UTCDateTime = fromZonedTime(localDateTime, timezone);

  // This treats the string as "Local Time in [Timezone]" and returns a UTC Date object
  return UTCDateTime;
}

export async function formatToLeagueTimezone(
  timeStr: string,
  leagueTimezone: string,
): Promise<String> {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("user-timezone")?.value || "UTC";

  const today = new Date().toISOString().split('T')[0];
  const leagueDateTime = `${today}T${timeStr}`;

  const leagueDate = toZonedTime(leagueDateTime, leagueTimezone);

  const viewerTime = formatInTimeZone(leagueDate, timezone, 'h:mm a z')

  return viewerTime;
}
