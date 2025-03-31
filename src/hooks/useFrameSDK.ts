"use client";

import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export function useFrameSDK() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await sdk.context;
        sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (error) {
        console.error("Error initializing Frame SDK:", error);
      }
    };

    if (sdk && !isSDKLoaded) {
      initializeSDK();
    }
  }, [isSDKLoaded]);

  return { isSDKLoaded };
}
