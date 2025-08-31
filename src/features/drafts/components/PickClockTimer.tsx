'use client';

// import React & Next components
import { useState, useEffect } from 'react';

// A utility function to format the remaining time
import { calculateTimeLeft } from '../utils/draft';

interface CountdownTimerProps {
  targetDate: Date;
}

export default function DraftCountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([unit, value]) => {
    if (!value) {
      return null;
    }
    return (
      <span key={unit} className="mx-2">
        {`${value} ${unit}`}
      </span>
    );
  });

  return (
    <p>
      {timerComponents.length ? timerComponents : <span>Time`&apos;`s up!</span>}
    </p>
  );
}
