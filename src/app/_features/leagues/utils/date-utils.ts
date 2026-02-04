// utils/date-utils.ts
import { cookies } from 'next/headers'

export async function formatToUserTimezone(date: Date | string | null | undefined) {
  if (!date) return { dateStr: '', timeStr: '' };
  
  const cookieStore = await cookies();
  const timezone = cookieStore.get('user-timezone')?.value || 'UTC';
  
  const d = typeof date === 'string' ? new Date(date) : date;

  const dateStr = d.toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD
  const timeStr = d.toLocaleTimeString('en-GB', { 
    timeZone: timezone, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  return { dateStr, timeStr };
}