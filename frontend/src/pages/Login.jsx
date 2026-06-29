import { useState } from "react";
import api from "../api/axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiAlertCircle
} from "react-icons/fi";

import { FaTruckMoving }
    from "react-icons/fa";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loginError, setLoginError] =
        useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoginError("");

        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            localStorage.setItem(
                "full_name",
                response.data.full_name
            );

            localStorage.setItem(
                "user_id",
                response.data.user_id
            );

            localStorage.setItem(
                "delivery_agent_id",
                response.data.delivery_agent_id
            );

            console.log(
                "Delivery Agent ID:",
                response.data.delivery_agent_id
            );

            console.log(
                JSON.stringify(
                    response.data,
                    null,
                    2
                )
            );

            console.log(
                "User ID:",
                response.data.user_id
            );

            localStorage.setItem(
                "change_password", 
                response.data.change_password
            );

            if (
                response.data.change_password
            ) {

                navigate(
                    "/change-password"
                );

            }

            else if (
                response.data.role ===
                "Admin"
            ) {

                navigate(
                    "/dashboard"
                );

            }

            else if (
                response.data.role ===
                "DeliveryAgent"
            ) {

                navigate(
                    "/agent-dashboard"
                );

            }

        } catch (error) {

            setLoginError(
                error.response?.data?.detail ||
                "Invalid email or password"
            );

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <div className="login-left">

                    <FaTruckMoving
                        className="login-logo"
                    />

                    <h1>
                        Final Mile
                        Delivery Hub
                    </h1>

                    <p>
                        Smart logistics platform
                        for managing parcels,
                        delivery agents and
                        real-time tracking.
                    </p>

                </div>

                <div className="login-card">

                    <h2>
                        Welcome Back 👋
                    </h2>

                    <p>
                        Sign in to continue
                    </p>

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

                            <FiMail
                                className="input-icon"
                            />

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => {

                                    setEmail(e.target.value);

                                    setLoginError("");

                                }}
                                required
                            />

                        </div>

                        <div className="input-group">

                            <FiLock
                                className="input-icon"
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {

                                    setPassword(e.target.value);

                                    setLoginError("");

                                }}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"

                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {
                                    showPassword
                                        ? <FiEyeOff />
                                        : <FiEye />
                                }

                            </button>

                        </div>

                        {
                            loginError && (

                                <div
                                    style={{
                                        background: "#fef2f2",
                                        color: "#dc2626",
                                        padding: "12px 16px",
                                        borderRadius: "12px",
                                        marginBottom: "18px",
                                        border: "1px solid #fecaca",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "8px",
                                        lineHeight: "1.5"
                                    }}
                                >
                                    <FiAlertCircle
                                        size={18}
                                    />

                                    <span>
                                        {loginError}
                                    </span>
                                </div>

                            )
                        }

                        <button
                            className="login-btn"
                            type="submit"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Login;