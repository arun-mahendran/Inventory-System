import { useState } from "react";
import api from "../api/axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff
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

    const handleSubmit = async (e) => {

        e.preventDefault();

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
                "delivery_agent_id",
                response.data.delivery_agent_id
            );

            console.log("Complete Login Response:");
            console.log(response.data);

            console.log(
                "Delivery Agent ID:",
                response.data.delivery_agent_id
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

            alert(
                error.response?.data?.detail
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
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
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
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
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