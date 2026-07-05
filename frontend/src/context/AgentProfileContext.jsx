import { createContext, useContext, useState } from "react";

const AgentProfileContext = createContext(null);

const PHOTO_STORAGE_KEY = "agentProfilePhoto";

export function AgentProfileProvider({ children }) {
    const [photo, setPhotoState] = useState(() => {
        try {
            return localStorage.getItem(PHOTO_STORAGE_KEY) || null;
        } catch {
            return null;
        }
    });

    const setPhoto = (url) => {
        setPhotoState(url);
        try {
            if (url) {
                localStorage.setItem(PHOTO_STORAGE_KEY, url);
            } else {
                localStorage.removeItem(PHOTO_STORAGE_KEY);
            }
        } catch {
            // ignore storage errors (e.g. private browsing)
        }
    };

    return (
        <AgentProfileContext.Provider value={{ photo, setPhoto }}>
            {children}
        </AgentProfileContext.Provider>
    );
}

export function useAgentProfile() {
    const ctx = useContext(AgentProfileContext);
    if (!ctx) {
        throw new Error("useAgentProfile must be used within an AgentProfileProvider");
    }
    return ctx;
}