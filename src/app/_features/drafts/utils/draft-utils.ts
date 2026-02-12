
export function calculateDeadline(startTime: Date, windowHours = 4) {
  let deadline = new Date(startTime.getTime() + windowHours * 60 * 60 * 1000);
  
  // Logic: If deadline falls after 10 PM, push it to 8 AM + remaining time
  const hour = deadline.getHours();
  if (hour >= 22 || hour < 8) {
    // Add the 10-hour "Sleep" gap
    deadline = new Date(deadline.getTime() + 10 * 60 * 60 * 1000);
  }
  
  return deadline;
}