"use client";

// import React & Next components
import { useState, useEffect } from "react";

// A utility function to format the remaining time
import { calculateTimeLeft } from "../utils/draft";

interface CountdownTimerProps {
  targetDate: Date | string | null | undefined;
}

export default function DraftCountdownTimer({
  targetDate,
}: CountdownTimerProps) {
  const safeDate = targetDate ? new Date(targetDate) : new Date();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(safeDate));

  useEffect(() => {
    const nextDate = targetDate ? new Date(targetDate) : new Date();
    setTimeLeft(calculateTimeLeft(nextDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timerComponents = Object.entries(timeLeft.dateData).map(
    ([unit, value]) => {
      return (
        <div key={unit} className="flex items-center">
          {`${value.toString().padStart(2, "0")}${unit.toLowerCase()}`}
        </div>
      );
    },
  );

  return (
    <div className="flex gap-1">
      {timeLeft.state.active && timerComponents.length ? (
        timerComponents
      ) : (
        <span>Time&apos;s up!</span>
      )}
    </div>
  );
}

export function PickCountdownTimer({ targetDate }: CountdownTimerProps) {
  const safeDate = targetDate ? new Date(targetDate) : new Date();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(safeDate));

  useEffect(() => {
    const nextDate = targetDate ? new Date(targetDate) : new Date();
    setTimeLeft(calculateTimeLeft(nextDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timerComponents = Object.entries(timeLeft.dateData)
    .filter(([unit]) => unit !== "D") // Skip the Days unit
    .map(([unit, value]) => {
      return (
        <div key={unit} className="flex text-xs text-green-500 font-mono">
          {`${value.toString().padStart(2, "0")}${unit.toLowerCase()}`}
        </div>
      );
    });

  return (
    <div className="flex gap-1">
      {timeLeft.state.active && timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-xs text-stone-400">Time&apos;s up!</span>
      )}
    </div>
  );
}
