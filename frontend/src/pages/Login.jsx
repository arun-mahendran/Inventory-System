import { useState } from "react";
import api from "../api/axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

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

            <div className="login-card">

                <h1>
                    Final Mile Delivery Hub
                </h1>

                <p>
                    Sign in to continue
                </p>

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;