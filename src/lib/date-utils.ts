// lib/draft-utils.ts
import { addHours, setHours, isAfter, isBefore, addDays } from 'date-fns';

export function calculateDeadline(startTime: Date, durationHours: number, pause: number, resume: number): Date {
  let deadline = addHours(startTime, durationHours);
  
  // If the deadline falls within the pause window, shift it to the next day
  const hour = deadline.getHours();
  if (hour >= pause || hour < resume) {
    const hoursIntoPause = hour >= pause ? hour - pause : hour + (24 - pause);
    deadline = addDays(setHours(deadline, resume), 0); 
    deadline = addHours(deadline, hoursIntoPause);
  }
  return deadline;
}