// lib/draft-utils.ts
import { addHours, setHours, addDays, startOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export function calculateDeadline(
  startTimeUTC: Date, 
  durationHours: number, 
  pauseHour: number, 
  resumeHour: number,
  leagueTz: string
): Date {
  // 1. Calculate the raw deadline in UTC first
  const initialDeadlineUTC = addHours(startTimeUTC, durationHours);

  // 2. See what time that is in the League's local "Wall Clock"
  const zonedDeadline = toZonedTime(initialDeadlineUTC, leagueTz);
  const hour = zonedDeadline.getHours();

  // 3. Determine if this hour is inside the forbidden "Pause" window
  const isPaused = pauseHour > resumeHour 
    ? (hour >= pauseHour || hour < resumeHour) // e.g. 22 to 8 (Overnight)
    : (hour >= pauseHour && hour < resumeHour); // e.g. 12 to 13 (Lunch break)

  if (!isPaused) return initialDeadlineUTC;

  // 4. Calculate "Owed Time"
  // How many hours of the pick duration fell into the pause?
  const hoursIntoPause = hour >= pauseHour 
    ? hour - pauseHour 
    : hour + (24 - pauseHour);

  // 5. Jump to the Resume Point
  // If the deadline hour is < resumeHour, we are on the same calendar day as the resume.
  // If the deadline hour is >= pauseHour, the resume happens tomorrow.
  const resumeDay = hour >= pauseHour ? addDays(zonedDeadline, 1) : zonedDeadline;
  const resumePointInTz = setHours(startOfDay(resumeDay), resumeHour);
  
  // 6. Add the "Owed Time" to the Resume Point
  const finalZonedDeadline = addHours(resumePointInTz, hoursIntoPause);

  // 7. Convert back to UTC for the database
  return fromZonedTime(finalZonedDeadline, leagueTz);
}