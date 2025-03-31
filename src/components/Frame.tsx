"use client";

import { useEffect, useState } from "react";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { EVENT_DATE } from "~/lib/constants";

// Function to calculate time remaining
function getTimeRemaining(endtime: Date) {
  const total = endtime.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(EVENT_DATE));
  
  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeRemaining(EVENT_DATE);
      setTimeLeft(t);
      
      if (t.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // If the countdown is over
  if (timeLeft.total <= 0) {
    return (
      <div className="myspace-container">
        <div className="myspace-header">
          <div className="myspace-blink">🎉 EVENT HAPPENING NOW! 🎉</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="myspace-container">
      <div className="myspace-header">
        <div className="myspace-title">✨ Friday Event Countdown ✨</div>
        <div className="myspace-subtitle">5:00 PM UTC</div>
      </div>
      
      <div className="myspace-countdown">
        <div className="myspace-time-block">
          <div className="myspace-time-value">{timeLeft.days}</div>
          <div className="myspace-time-label">DAYS</div>
        </div>
        <div className="myspace-time-block">
          <div className="myspace-time-value">{timeLeft.hours}</div>
          <div className="myspace-time-label">HOURS</div>
        </div>
        <div className="myspace-time-block">
          <div className="myspace-time-value">{timeLeft.minutes}</div>
          <div className="myspace-time-label">MINS</div>
        </div>
        <div className="myspace-time-block">
          <div className="myspace-time-value">{timeLeft.seconds}</div>
          <div className="myspace-time-label">SECS</div>
        </div>
      </div>
      
      <div className="myspace-footer">
        <div className="myspace-marquee">
          <span>⭐ Don&apos;t miss it! ⭐ Tell your friends! ⭐ Be there or be square! ⭐</span>
        </div>
      </div>
    </div>
  );
}

export default function Frame() {
  const { isSDKLoaded } = useFrameSDK();

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2">
      <CountdownTimer />
    </div>
  );
}
