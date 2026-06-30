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

                        <div
    style={{
        position: "absolute",

        bottom: "30px",

        left: "50%",

        transform: "translateX(-50%)",

        textAlign: "center",

        width: "100%"
    }}
>
  <p
    style={{
      margin: 0,
      color: "#64748b",
      fontSize: "14px",
    }}
  >
    Interested in becoming a Delivery Agent?
  </p>

  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=finalmile.hr@gmail.com&su=Application%20for%20Delivery%20Agent%20Position&body=Dear%20HR,%0A%0AI%20am%20interested%20in%20joining%20Final%20Mile%20Delivery%20Hub%20as%20a%20Delivery%20Agent.%20Please%20find%20my%20details%20below:%0A%0AFull%20Name:%20%0AEmail:%20%0APhone%20Number:%20%0AAddress:%20%0APincode:%20%0APreferred%20Hub%20(Kovilpatti%20/%20Madurai%20/%20Sivakasi%20/%20Virudhunagar%20/%20Sattur):%20%0AVehicle%20Number:%20%0AYears%20of%20Delivery%20Experience:%20%0A%0AThank%20you."
    target="_blank"
    rel="noopener noreferrer"
    style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        marginTop: "10px",
        color: "#2563eb",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "600",
        transition: "0.3s ease",
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.color = "#1d4ed8";
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.color = "#2563eb";
    }}
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