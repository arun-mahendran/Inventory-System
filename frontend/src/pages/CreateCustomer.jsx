import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../components/MainLayout";

function CreateCustomer() {

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const [createdCustomer, setCreatedCustomer] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        pincode: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/customers/",
                formData
            );

            setCreatedCustomer(
                response.data
            );

            setShowModal(true);

            setFormData({
                customer_name: "",
                phone: "",
                email: "",
                address: "",
                pincode: ""
            });

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed to create customer"
            );

        }

    };

    return (

        <>
            <MainLayout>

                    {showModal && (

                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background:
                                    "rgba(15,23,42,0.45)",
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
                                    width: "500px",
                                    maxWidth: "90%",
                                    padding: "40px",
                                    borderRadius: "30px",
                                    textAlign: "center",
                                    position: "relative",
                                    boxShadow:
                                        "0 25px 60px rgba(0,0,0,0.18)"
                                }}
                            >

                                <div
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: "#dcfce7",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "0 auto 25px"
                                    }}
                                >

                                    <span
                                        style={{
                                            fontSize: "42px"
                                        }}
                                    >
                                        👤
                                    </span>

                                </div>

                                <h1
                                    style={{
                                        marginBottom: "12px",
                                        color: "#0f172a"
                                    }}
                                >
                                    Customer Created
                                </h1>

                                <p
                                    style={{
                                        color: "#64748b",
                                        marginBottom: "30px"
                                    }}
                                >
                                    Customer information has been
                                    successfully saved.
                                </p>

                                <div
                                    style={{
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "18px",
                                        padding: "20px",
                                        textAlign: "left",
                                        marginBottom: "30px"
                                    }}
                                >

                                    <p>
                                        <b>Name:</b>{" "}
                                        {createdCustomer?.customer_name}
                                    </p>

                                    <p>
                                        <b>Phone:</b>{" "}
                                        {createdCustomer?.phone}
                                    </p>

                                    <p>
                                        <b>Pincode:</b>{" "}
                                        {createdCustomer?.pincode}
                                    </p>

                                </div>

                                <button
                                    onClick={() => {

                                        setShowModal(false);

                                        navigate("/customers");

                                    }}

                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        border: "none",
                                        borderRadius: "16px",
                                        background:
                                            "linear-gradient(90deg,#2563eb,#3b82f6)",
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

                    <h1>
                        Create Customer
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

                        {/* Customer Name */}

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <label>
                                Customer Name
                            </label>

                            <input
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />

                        </div>

                        {/* Email */}

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

                        {/* Phone */}

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

                        {/* Address */}

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            />

                        </div>

                        {/* Pincode */}

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
                            Create Customer
                        </button>

                    </form>

                </MainLayout>
        </>

    );

}

export default CreateCustomer;