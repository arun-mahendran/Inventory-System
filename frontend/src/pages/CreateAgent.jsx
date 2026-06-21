import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";

function CreateAgent() {

    //const navigate = useNavigate();

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

    const [showModal, setShowModal] =
    useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

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
                            <label>
                                Hub ID
                            </label>

                            <input
                                type="number"
                                name="hub_id"
                                value={formData.hub_id}
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
                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Create Agent
                        </button>

                    </form>

                    {showModal && (

                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background:
                                    "rgba(0,0,0,0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1000
                            }}
                        >

                            <div
                                style={{
                                    background: "white",
                                    padding: "35px",
                                    borderRadius: "20px",
                                    width: "450px",
                                    textAlign: "center",
                                    boxShadow:
                                        "0 20px 40px rgba(0,0,0,0.2)"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "60px",
                                        marginBottom: "15px"
                                    }}
                                >
                                    ✅
                                </div>

                                <h2
                                    style={{
                                        color: "#059669",
                                        marginBottom: "15px"
                                    }}
                                >
                                    Agent Created Successfully
                                </h2>

                                <p>
                                    Temporary Password
                                </p>

                                <div
                                    style={{
                                        background: "#f1f5f9",
                                        padding: "15px",
                                        borderRadius: "12px",
                                        marginTop: "10px",
                                        fontSize: "22px",
                                        fontWeight: "700",
                                        color: "#2563eb",
                                        letterSpacing: "3px"
                                    }}
                                >
                                    {
                                        createdAgent?.temporary_password
                                    }
                                </div>

                                <p
                                    style={{
                                        marginTop: "20px",
                                        color: "#64748b"
                                    }}
                                >
                                    Share this password with
                                    the delivery agent.
                                </p>

                                <button
                                    onClick={() =>
                                        setShowModal(false)
                                    }

                                    style={{
                                        marginTop: "25px",
                                        background: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 30px",
                                        borderRadius: "10px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Close
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