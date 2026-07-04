import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiAlertCircle,
    FiPackage,
    FiTruck,
    FiMapPin
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

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const leftPanelRef = useRef(null);
    const cardRef = useRef(null);
    const btnRef = useRef(null);

    // const [hubCount, setHubCount] = useState(0);
    // const [agentCount, setAgentCount] = useState(0);

    useEffect(() => {

        const duration = 1000;
        const start = performance.now() + 400; // wait for panel fade-in

        let frame;

        const tick = (now) => {

            const elapsed = now - start;
            const progress = Math.min(Math.max(elapsed / duration, 0), 1);
            //const eased = 1 - Math.pow(1 - progress, 3);

            // setHubCount(Math.round(eased * 24));
            // setAgentCount(Math.round(eased * 500));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }

        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);

    }, []);

    const handleLeftPanelMove = (e) => {
        const el = leftPanelRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--tiltX", x.toFixed(3));
        el.style.setProperty("--tiltY", y.toFixed(3));
    };

    const handleLeftPanelLeave = () => {
        const el = leftPanelRef.current;
        if (!el) return;
        el.style.setProperty("--tiltX", 0);
        el.style.setProperty("--tiltY", 0);
    };

    const handleCardMove = (e) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--spot-x", `${x}%`);
        el.style.setProperty("--spot-y", `${y}%`);
    };

    // const handleBtnMove = (e) => {
    //     const el = btnRef.current;
    //     if (!el) return;
    //     const rect = el.getBoundingClientRect();
    //     const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    //     const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    //     el.style.transform = `translate(${x}px, ${y}px)`;
    // };

    // const handleBtnLeave = () => {
    //     const el = btnRef.current;
    //     if (!el) return;
    //     el.style.transform = "translate(0, 0)";
    // };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoginError("");
        setIsSubmitting(true);

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

        } finally {

            setIsSubmitting(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <div
                    className="login-left"
                    ref={leftPanelRef}
                    onMouseMove={handleLeftPanelMove}
                    onMouseLeave={handleLeftPanelLeave}
                >

                    <span className="ambient-dot d1" />
                    <span className="ambient-dot d2" />

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
                        <svg
    viewBox="0 0 500 28"
    preserveAspectRatio="none"
>

    <path
    className="route-path"
    d="M10 16 L490 16"
/>

<path
    className="route-progress"
    d="M10 16 L490 16"
/>

    <circle
    cx="10"
    cy="16"
    r="4"
    fill="#ff5a1f"
/>

    <circle
    cx="490"
    cy="16"
    r="4"
    fill="#ff5a1f"
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

        <FiPackage className="feature-icon" />

        <span className="stat-value">
            Parcel
        </span>

        <span className="stat-label">
            Management
        </span>

    </div>

    <div className="login-stat">

        <FiTruck className="feature-icon" />

        <span className="stat-value">
            Delivery
        </span>

        <span className="stat-label">
            Operations
        </span>

    </div>

    <div className="login-stat">

        <FiMapPin className="feature-icon" />

        <span className="stat-value">
            Live
        </span>

        <span className="stat-label">
            Tracking
        </span>

    </div>

</div>

                </div>

                <div
                    className="login-card"
                    ref={cardRef}
                    onMouseMove={handleCardMove}
                >

                    <div className="card-spotlight" />

                    <div className="manifest-id">
                        FINAL MILE <span>v1.0</span>
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
                                placeholder=" "
                                value={email}
                                onChange={(e) => {

                                    setEmail(e.target.value);

                                    setLoginError("");

                                }}
                                required
                            />

                            <label>Email</label>

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
                                placeholder=" "
                                value={password}
                                onChange={(e) => {

                                    setPassword(e.target.value);

                                    setLoginError("");

                                }}
                                required
                            />

                            <label>Password</label>

                            <FiLock
                                className="input-icon"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }

                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                <span
                                    className={
                                        "icon-swap" +
                                        (showPassword ? " is-visible" : "")
                                    }
                                >
                                    <FiEye className="i-eye" />
                                    <FiEyeOff className="i-eye-off" />
                                </span>

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
                            ref={btnRef}
                            disabled={isSubmitting}
                            //onMouseMove={handleBtnMove}
                            //onMouseLeave={handleBtnLeave}
                        >
                            {
                                isSubmitting && (
                                    <span className="btn-spinner" />
                                )
                            }
                            {
                                isSubmitting
                                    ? "Signing in..."
                                    : "Login"
                            }
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