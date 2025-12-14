"use client";

// import React & Next components
import { useState, useEffect } from "react";

// A utility function to format the remaining time
import { calculateTimeLeft } from "../utils/draft";

interface CountdownTimerProps {
  targetDate: Date;
}

export default function DraftCountdownTimer({
  targetDate,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  });

  if (!timeLeft.state.active) {
    const timerComponents = null;
  }

  const timerComponents = Object.entries(timeLeft.dateData).map(
    ([unit, value]) => {
      return (
        <div key={unit} className="flex flex-col items-center">
          <p>
            {`${unit}: ${value.toString().padStart(2,"0")}`} &nbsp;
          </p>
        </div>
      );
    },
  );

  return (
    <div className="flex">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span>Time`&apos;`s up!</span>
      )}
    </div>
  );
}
