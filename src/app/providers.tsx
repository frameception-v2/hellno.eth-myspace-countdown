"use client";

import dynamic from "next/dynamic";
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// Add PostHog to Window type
declare global {
  interface Window {
    posthog?: typeof posthog;
  }
}

// Define the state type
interface AppState {
  user: {
    fid?: string | null;
    username?: string;
    displayName?: string;
  } | null;
}

// Define action types
type Action = 
  | { type: 'SET_USER'; payload: { fid?: string | null; username?: string; displayName?: string } }
  | { type: 'CLEAR_USER' };

// Create initial state
const initialState: AppState = {
  user: null
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

// Reducer function
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

const WagmiProvider = dynamic(
  () => import("~/components/providers/WagmiProvider"),
  {
    ssr: false,
  },
);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      persistence: "memory",
      person_profiles: "identified_only",
      loaded: (ph) => {
        // Generate anonymous session ID without identifying
        const sessionId = ph.get_distinct_id() || crypto.randomUUID();
        ph.register({ session_id: sessionId });

        // Temporary distinct ID that will be aliased later
        if (!ph.get_distinct_id()) {
          ph.reset(true); // Ensure clean state
        }
      },
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Provider component
export function Providers({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // PostHog integration
  useEffect(() => {
    if (typeof window !== 'undefined' && window.posthog && state.user?.fid) {
      const fidId = `fc_${state.user.fid}`;
      const currentId = posthog.get_distinct_id();
      
      // Skip if already identified with this FID
      if (currentId === fidId) return;

      // Create alias from session ID → FID
      posthog.alias(fidId, currentId);

      // Identify future events with FID
      posthog.identify(fidId, {
        farcaster_username: state.user.username,
        farcaster_display_name: state.user.displayName,
        farcaster_fid: state.user.fid,
      });
    }
  }, [state.user]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <WagmiProvider>
        <PostHogProvider>{children}</PostHogProvider>
      </WagmiProvider>
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a Providers component');
  }
  return context;
}
