"use client";

import { useEffect, useState } from "react";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { EVENT_DATE, PROJECT_TITLE } from "~/lib/constants";

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
  const [blinkState, setBlinkState] = useState(true);
  
  useEffect(() => {
    // Timer for countdown
    const timer = setInterval(() => {
      const t = getTimeRemaining(EVENT_DATE);
      setTimeLeft(t);
      
      if (t.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    // Timer for blinking effect
    const blinkTimer = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 800);
    
    return () => {
      clearInterval(timer);
      clearInterval(blinkTimer);
    };
  }, []);
  
  // If the countdown is over
  if (timeLeft.total <= 0) {
    return (
      <div className="myspace-container" style={{
        border: "3px solid #6699cc",
        borderRadius: "8px",
        background: "#eef5ff",
        padding: "15px",
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
        maxWidth: "300px"
      }}>
        <div className="myspace-header" style={{
          textAlign: "center",
          marginBottom: "10px"
        }}>
          <div className="myspace-blink" style={{
            color: "#ff0066",
            fontWeight: "bold",
            fontSize: "20px",
            visibility: blinkState ? "visible" : "hidden"
          }}>🎉 EVENT HAPPENING NOW! 🎉</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="myspace-container" style={{
      border: "3px solid #6699cc",
      borderRadius: "8px",
      background: "#eef5ff",
      padding: "15px",
      fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
      maxWidth: "300px"
    }}>
      <div className="myspace-header" style={{
        textAlign: "center",
        marginBottom: "15px",
        borderBottom: "2px dashed #6699cc",
        paddingBottom: "10px"
      }}>
        <div className="myspace-title" style={{
          color: "#ff0066",
          fontWeight: "bold",
          fontSize: "18px",
          textShadow: "1px 1px 2px #cccccc"
        }}>✨ {PROJECT_TITLE} ✨</div>
        <div className="myspace-subtitle" style={{
          color: "#333333",
          fontSize: "14px",
          marginTop: "5px"
        }}>5:00 PM UTC</div>
      </div>
      
      <div className="myspace-countdown" style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}>
        <div className="myspace-time-block" style={{
          textAlign: "center",
          background: "#ffffff",
          border: "2px solid #ff6699",
          borderRadius: "5px",
          padding: "8px 5px",
          width: "22%"
        }}>
          <div className="myspace-time-value" style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ff0066"
          }}>{timeLeft.days}</div>
          <div className="myspace-time-label" style={{
            fontSize: "10px",
            color: "#666666"
          }}>DAYS</div>
        </div>
        <div className="myspace-time-block" style={{
          textAlign: "center",
          background: "#ffffff",
          border: "2px solid #ff6699",
          borderRadius: "5px",
          padding: "8px 5px",
          width: "22%"
        }}>
          <div className="myspace-time-value" style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ff0066"
          }}>{timeLeft.hours}</div>
          <div className="myspace-time-label" style={{
            fontSize: "10px",
            color: "#666666"
          }}>HOURS</div>
        </div>
        <div className="myspace-time-block" style={{
          textAlign: "center",
          background: "#ffffff",
          border: "2px solid #ff6699",
          borderRadius: "5px",
          padding: "8px 5px",
          width: "22%"
        }}>
          <div className="myspace-time-value" style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ff0066"
          }}>{timeLeft.minutes}</div>
          <div className="myspace-time-label" style={{
            fontSize: "10px",
            color: "#666666"
          }}>MINS</div>
        </div>
        <div className="myspace-time-block" style={{
          textAlign: "center",
          background: "#ffffff",
          border: "2px solid #ff6699",
          borderRadius: "5px",
          padding: "8px 5px",
          width: "22%"
        }}>
          <div className="myspace-time-value" style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ff0066"
          }}>{timeLeft.seconds}</div>
          <div className="myspace-time-label" style={{
            fontSize: "10px",
            color: "#666666"
          }}>SECS</div>
        </div>
      </div>
      
      <div className="myspace-footer" style={{
        marginTop: "10px",
        borderTop: "2px dashed #6699cc",
        paddingTop: "10px"
      }}>
        <div className="myspace-marquee" style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          background: "#ffccff",
          padding: "5px",
          borderRadius: "5px"
        }}>
          <div style={{
            display: "inline-block",
            animation: "marquee 15s linear infinite",
            paddingLeft: "100%"
          }}>
            <span style={{ color: "#3366cc" }}>⭐ Don&apos;t miss it! ⭐ Tell your friends! ⭐ Be there or be square! ⭐</span>
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
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
