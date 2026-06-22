import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function ChangePassword() {

    const navigate = useNavigate();

    const userId =
        localStorage.getItem("user_id");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword,
        setConfirmPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [errorMessage,
        setErrorMessage] =
        useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            newPassword !==
            confirmPassword
        ) {

            setErrorMessage(
                "Passwords do not match"
            );
            return;
        }

        try {
            await api.patch(
                `/users/${userId}/change-password`,
                {
                    new_password:
                        newPassword
                }
            );

            setMessage(
                "Password changed successfully!"
            );

            localStorage.setItem(
                "change_password",
                "false"
            );

            const role =
                localStorage.getItem("role");

            setTimeout(() => {

            if (role === "Admin") {

                navigate("/dashboard");

            } else {

                navigate("/agent-dashboard");

            }

        }, 2000);

        } catch (error) {

            setErrorMessage(
                "Failed to change password"
            );
        }

    };

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg, #eff6ff, #dbeafe)"
            }}
        >

            <div
                style={{
                    width: "420px",
                    background: "white",
                    padding: "40px",
                    borderRadius: "24px",
                    boxShadow:
                        "0 20px 40px rgba(0,0,0,0.1)"
                }}
            >

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >

                    <div
                        style={{
                            fontSize: "55px",
                            marginBottom: "10px"
                        }}
                    >
                        🔐
                    </div>

                    <h1
                        style={{
                            marginBottom: "10px",
                            color: "#0f172a"
                        }}
                    >
                        Change Password
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                            fontSize: "15px"
                        }}
                    >
                        Please change your temporary password
                        to continue.
                    </p>

                </div>

                {
                    message && (

                        <div
                            style={{
                                background: "#dcfce7",
                                color: "#166534",
                                padding: "12px",
                                borderRadius: "12px",
                                marginBottom: "20px",
                                fontWeight: "600",
                                textAlign: "center"
                            }}
                        >
                            ✅ {message}
                        </div>

                    )
                }

                {
                    errorMessage && (

                        <div
                            style={{
                                background: "#fee2e2",
                                color: "#991b1b",
                                padding: "12px",
                                borderRadius: "12px",
                                marginBottom: "20px",
                                fontWeight: "600",
                                textAlign: "center"
                            }}
                        >
                            ❌ {errorMessage}
                        </div>

                    )
                }

                <form onSubmit={handleSubmit}>

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                                color: "#334155"
                            }}
                        >
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }

                            required

                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "14px",
                                border:
                                    "2px solid #e2e8f0",
                                fontSize: "15px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>

                    <div
                        style={{
                            marginBottom: "30px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                                color: "#334155"
                            }}
                        >
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }

                            required

                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "14px",
                                border:
                                    "2px solid #e2e8f0",
                                fontSize: "15px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>

                    <button
                        type="submit"

                        style={{
                            width: "100%",
                            padding: "15px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "14px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Update Password
                    </button>

                </form>

            </div>

        </div>

    );
}

export default ChangePassword;