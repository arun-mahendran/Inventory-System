import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";
import { FiCopy, FiX } from "react-icons/fi";
import { LuKeyRound } from "react-icons/lu";
import { HiOutlineCheckCircle } from "react-icons/hi";

function CreateAgent() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        hub_id: "",
        vehicle_number: "",
        pincode: ""
    });

    const [createdAgent, setCreatedAgent] =
    useState(null);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] =
    useState(false);

    const [hubs, setHubs] = useState([]);

    const [copied, setCopied] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post(
                "/delivery-agents/",
                {
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    hub_id: Number(formData.hub_id),
                    vehicle_number: formData.vehicle_number,
                    pincode: formData.pincode
                }
            );

            setCreatedAgent(response.data);
            setShowModal(true);

            setFormData({
                full_name: "",
                email: "",
                phone: "",
                hub_id: "",
                vehicle_number: "",
                pincode: ""
            });

            //navigate("/delivery-agents");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed to create agent"
            );

        }

    };

    useEffect(() => {

    const fetchHubs = async () => {

        try {

            const response = await api.get(
                "/hubs/"
            );

            console.log(response.data);

            setHubs(response.data);

        } catch (error) {

            console.error(
                "Hub Error:",
                error
            );

        }

    };

    fetchHubs();

}, []);

    return (

        <>
            <Navbar />

            <div
                style={{
                    display: "flex"
                }}
            >

                <Sidebar />

                <PageContainer>

                    <h1>
                        Create Delivery Agent
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "white",
                            marginTop: "25px",
                            padding: "24px",
                            borderRadius: "18px",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,0.08)"
                        }}
                    >

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />
                        </div>

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
                                Hub
                            </label>

                            <select
                                name="hub_id"

                                value={formData.hub_id}

                                onChange={handleChange}

                                required

                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    borderRadius: "12px",
                                    border: "1px solid #d1d5db",
                                    fontSize: "15px",
                                    background: "#f8fafc",
                                    color: "#0f172a",
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >

                                <option value="">
                                    Select Hub
                                </option>

                                {hubs.map((hub) => (

                                    <option
                                        key={hub.id}
                                        value={hub.id}
                                    >
                                        {hub.hub_name}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label>
                                Vehicle Number
                            </label>

                            <input
                                type="text"
                                name="vehicle_number"
                                value={
                                    formData.vehicle_number
                                }
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label>
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background:
                                    loading
                                        ? "#94a3b8"
                                        : "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "10px",
                                cursor:
                                    loading
                                        ? "not-allowed"
                                        : "pointer",
                                opacity:
                                    loading ? 0.8 : 1
                            }}
                        >
                            {
                                loading
                                    ? "Creating..."
                                    : "Create Agent"
                            }
                        </button>

                    </form>


                    {copied && (
                        <div
                            style={{
                                position: "fixed",
                                top: "25px",
                                right: "25px",
                                background: "#16a34a",
                                color: "white",
                                padding: "14px 22px",
                                borderRadius: "14px",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.15)",
                                zIndex: 10000,
                                fontWeight: "600"
                            }}
                        >
                            ✓ Password copied successfully
                        </div>

                    )}

                    {showModal && (

                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                background: "rgba(15,23,42,0.55)",
                                backdropFilter: "blur(4px)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999
                            }}
                        >

                            <div
                                style={{
                                    background: "white",
                                    width: "420px",
                                    maxWidth: "90%",
                                    borderRadius: "28px",
                                    padding: "35px",
                                    position: "relative",
                                    textAlign: "center",
                                    boxShadow:
                                        "0 25px 60px rgba(0,0,0,0.18)"
                                }}
                            >

                            {/* Close Button */}

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }

                                style={{
                                    position: "absolute",
                                    top: "18px",
                                    right: "18px",
                                    border: "none",
                                    background: "#f1f5f9",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <FiX size={18} />
                            </button>


                            {/* Success Icon */}

                            <div
                                style={{
                                    width: "75px",
                                    height: "75px",
                                    margin: "0 auto 25px",
                                    borderRadius: "50%",
                                    background: "#dcfce7",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >

                                <HiOutlineCheckCircle
                                    size={42}
                                    color="#16a34a"
                                />

                            </div>

                            <h2
                                style={{
                                    marginBottom: "24px",
                                    color: "#0f172a"
                                }}
                            >
                                Delivery Agent Created
                            </h2>


                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "18px"
                                }}
                            >

                                <LuKeyRound
                                    size={20}
                                    color="#64748b"
                                />

                                <span
                                    style={{
                                        color: "#64748b",
                                        fontWeight: "600"
                                    }}
                                >
                                    Temporary Password
                                </span>

                            </div>


                            {/* Password Box */}

                            <div
                                style={{
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "16px",
                                    padding: "16px 18px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >

                                <span
                                    style={{
                                        fontSize: "26px",
                                        fontWeight: "700",
                                        color: "#2563eb",
                                        letterSpacing: "3px"
                                    }}
                                >
                                    {
                                        createdAgent?.temporary_password
                                    }
                                </span>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            createdAgent?.temporary_password
                                        );
                                        setCopied(true);
                                        setTimeout(() => {
                                            setCopied(false);
                                        }, 3000);
                                    }}

                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "#2563eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >

                                    <FiCopy size={22} />
                                </button>

                            </div>

                           <p
                                style={{
                                    color: "#64748b",
                                    fontSize: "14px",
                                    marginTop: "16px",
                                    marginBottom: "18px",
                                    lineHeight: "1.5"
                                }}
                            >
                                Share this temporary password with the
                                delivery agent. 
                            </p>


                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    navigate(
                                        "/delivery-agents"
                                    );
                                }}

                                style={{
                                    marginTop: "15px",
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "14px",
                                    border: "none",
                                    background:
                                        "linear-gradient(135deg,#2563eb,#3b82f6)",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Done
                            </button>

                        </div>

                        </div>

                    )}

                </PageContainer>

            </div>

        </>

    );

}

export default CreateAgent;