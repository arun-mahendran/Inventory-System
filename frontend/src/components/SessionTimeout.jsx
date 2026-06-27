import { useEffect } from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import { toast } from "react-toastify";

function SessionTimeout() {

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {

        // No timeout on Login page
        if (
            location.pathname === "/login"
        ) {
            return;
        }

        let timeout;

        const logoutUser = () => {

            localStorage.clear();

            toast.warning(
                "Session expired. Please login again."
            );

            navigate("/login");
        };

        const resetTimer = () => {

            clearTimeout(timeout);

            const role =
                localStorage.getItem("role");

            const timeoutDuration =
                role === "Admin"
                    ? 30 * 60 * 1000 // 30 minutes
                    : 15 * 60 * 1000; // 15 minutes

            timeout = setTimeout(
                logoutUser,
                timeoutDuration
            );
        };

        const events = [
            "mousemove",
            "mousedown",
            "keypress",
            "scroll",
            "touchstart"
        ];

        events.forEach(event =>
            window.addEventListener(
                event,
                resetTimer
            )
        );

        // Start timer immediately
        resetTimer();

        return () => {

            clearTimeout(timeout);

            events.forEach(event =>
                window.removeEventListener(
                    event,
                    resetTimer
                )
            );
        };

    }, [navigate, location]);

    return null;
}

export default SessionTimeout;