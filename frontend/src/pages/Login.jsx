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

                    <div className="login-eyebrow">
                        Ops Console
                    </div>

                    <div className="login-logo-row">
                        <FaTruckMoving className="login-logo" />
                    </div>

                    <h1>
                        Final Mile
                        Delivery Hub
                    </h1>

                    <div className="route-line">
                        <svg viewBox="0 0 320 28" preserveAspectRatio="none">
                            <path
                                className="route-path"
                                d="M0,14 L320,14"
                            />
                            <path
                                className="route-progress"
                                d="M0,14 L320,14"
                            />
                        </svg>
                        <FaTruckMoving className="route-truck" />
                    </div>

                    <p className="login-copy">
                        Smart logistics platform for managing
                        parcels, delivery agents and real-time
                        tracking.
                    </p>

                    <div className="login-stats">
                        <div className="login-stat">
                            <span className="stat-value">24</span>
                            <span className="stat-label">Hubs</span>
                        </div>
                        <div className="login-stat">
                            <span className="stat-value">500+</span>
                            <span className="stat-label">Agents</span>
                        </div>
                        <div className="login-stat">
                            <span className="stat-value">Live</span>
                            <span className="stat-label">Tracking</span>
                        </div>
                    </div>

                </div>

                <div className="login-card">

                    <div className="manifest-id">
                        MANIFEST <span>#0192-A</span>
                    </div>

                    <h2>
                        Welcome Back
                    </h2>

                    <p className="login-sub">
                        Sign in to continue
                    </p>

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

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

                            <FiMail
                                className="input-icon"
                            />

                        </div>

                        <div className="input-group">

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

                            <FiLock
                                className="input-icon"
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

                                <div className="login-error">
                                    <FiAlertCircle size={18} />
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

                        <div className="agent-cta">
                            <p>
                                Interested in becoming a Delivery Agent?
                            </p>

                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=finalmile.hr@gmail.com&su=Application%20for%20Delivery%20Agent%20Position&body=Dear%20HR,%0A%0AI%20am%20interested%20in%20joining%20Final%20Mile%20Delivery%20Hub%20as%20a%20Delivery%20Agent.%20Please%20find%20my%20details%20below:%0A%0AFull%20Name:%20%0AEmail:%20%0APhone%20Number:%20%0AAddress:%20%0APincode:%20%0APreferred%20Hub%20(Kovilpatti%20/%20Madurai%20/%20Sivakasi%20/%20Virudhunagar%20/%20Sattur):%20%0AVehicle%20Number:%20%0AYears%20of%20Delivery%20Experience:%20%0A%0AThank%20you."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FiMail size={16} />
                                Contact HR
                            </a>
                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Login;