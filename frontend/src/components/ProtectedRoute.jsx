import {
    Navigate,
    useLocation
} from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRoles
}) {

    const token =
        localStorage.getItem(
            "token"
        );

    const role =
        localStorage.getItem(
            "role"
        );

    const changePassword =
        localStorage.getItem(
            "change_password"
        ) === "true";

    const location =
        useLocation();

    // User not logged in

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    // Force Delivery Agent
    // to change password

    if (

        role === "DeliveryAgent"

        &&

        changePassword

        &&

        location.pathname !==
        "/change-password"

    ) {

        return (
            <Navigate
                to="/change-password"
                replace
            />
        );

    }

    // Role check

    if (

        allowedRoles

        &&

        !allowedRoles.includes(
            role
        )

    ) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;
}

export default ProtectedRoute;