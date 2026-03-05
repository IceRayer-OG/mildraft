// lib/draft-utils.ts
import { 
  addMilliseconds, 
  setHours, 
  setMinutes, 
  setSeconds, 
  setMilliseconds, 
  addDays, 
  startOfDay, 
  differenceInMilliseconds 
} from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export function calculateDeadline(
  startTimeUTC: Date, 
  durationHours: number, 
  pauseHour: number, 
  resumeHour: number,
  leagueTz: string
): Date {
  // 1. Initial raw deadline in UTC
  const durationMs = durationHours * 60 * 60 * 1000;
  const initialDeadlineUTC = addMilliseconds(startTimeUTC, durationMs);

  // 2. Convert that deadline to League Local Time
  const zonedDeadline = toZonedTime(initialDeadlineUTC, leagueTz);
  
  // 3. Define the Pause Start boundary for that day in Local Time
  let zonedPauseStart = startOfDay(zonedDeadline);
  zonedPauseStart = setHours(zonedPauseStart, pauseHour);
  zonedPauseStart = setMinutes(zonedPauseStart, 0);
  zonedPauseStart = setSeconds(zonedPauseStart, 0);
  zonedPauseStart = setMilliseconds(zonedPauseStart, 0);

  // 4. Determine if the deadline falls inside the pause window
  const hour = zonedDeadline.getHours();
  const isPaused = pauseHour > resumeHour 
    ? (hour >= pauseHour || hour < resumeHour)
    : (hour >= pauseHour && hour < resumeHour);

  if (!isPaused) return initialDeadlineUTC;

  // 5. Calculate "Owed Time" (Overflow)
  // We need to know exactly how far past the start of the pause the deadline fell.
  let overflowMs: number;
  
  if (hour >= pauseHour) {
    // Case A: Deadline fell after pause started on the same day
    overflowMs = differenceInMilliseconds(zonedDeadline, zonedPauseStart);
  } else {
    // Case B: Deadline fell after midnight but before resume (overnight pause)
    // We compare it to the pause start of the PREVIOUS day
    const prevDayPauseStart = addDays(zonedPauseStart, -1);
    overflowMs = differenceInMilliseconds(zonedDeadline, prevDayPauseStart);
  }

  // 6. Calculate the Resume Point
  // If hour >= pauseHour, the draft resumes tomorrow.
  // If hour < resumeHour, it resumes today.
  const resumeDay = hour >= pauseHour ? addDays(zonedDeadline, 1) : zonedDeadline;
  
  let resumePointInTz = startOfDay(resumeDay);
  resumePointInTz = setHours(resumePointInTz, resumeHour);
  resumePointInTz = setMinutes(resumePointInTz, 0);
  resumePointInTz = setSeconds(resumePointInTz, 0);
  resumePointInTz = setMilliseconds(resumePointInTz, 0);

  // 7. Final Deadline = Resume Time + the exact Overflow
  const finalZonedDeadline = addMilliseconds(resumePointInTz, overflowMs);

  // 8. Convert back to UTC
  return fromZonedTime(finalZonedDeadline, leagueTz);
}

export function getEffectiveStartTime(
  currentTimeUTC: Date,
  pauseHour: number,
  resumeHour: number,
  leagueTz: string
): Date {
  const zonedCurrent = toZonedTime(currentTimeUTC, leagueTz);
  const hour = zonedCurrent.getHours();

  // Check if we are currently in the pause window
  const isPaused = pauseHour > resumeHour 
    ? (hour >= pauseHour || hour < resumeHour) // Overnights (e.g., 22:00 to 08:00)
    : (hour >= pauseHour && hour < resumeHour); // Same day (e.g., 12:00 to 14:00)

  if (!isPaused) return currentTimeUTC;

  // Move to the next resume point
  const resumeDay = hour >= pauseHour ? addDays(zonedCurrent, 1) : zonedCurrent;
  
  let resumePoint = startOfDay(resumeDay);
  resumePoint = setHours(resumePoint, resumeHour);
  resumePoint = setMinutes(resumePoint, 0);
  resumePoint = setSeconds(resumePoint, 0);
  resumePoint = setMilliseconds(resumePoint, 0);

  return fromZonedTime(resumePoint, leagueTz);
}