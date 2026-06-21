import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import MainLayout from "../components/MainLayout";

function CreateParcel() {

    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
    useState("");

    const [formData, setFormData] = useState({
        tracking_number: "",
        customer_id: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        try {

            await api.post(
                "/parcels/",
                {
                    tracking_number:
                        formData.tracking_number,

                    customer_id:
                        Number(formData.customer_id)
                }
            );

            setSuccessMessage(
                "Parcel Created Successfully ✅"
            );

            setTimeout(() => {
                navigate("/parcels");
            }, 1500);

        } catch (error) {

            console.error(
                "Create Parcel Error:",
                error
            );

            setErrorMessage(
                error.response?.data?.detail ||
                "Failed to create parcel"
            );

        }

    };

    return (
        <>
            <MainLayout>

                    <h1>
                        Create Parcel
                    </h1>

                    {
                        successMessage && (

                            <div
                                style={{
                                    background: "#dcfce7",
                                    color: "#15803d",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    marginTop: "20px",
                                    marginBottom: "20px",
                                    fontWeight: "600"
                                }}
                            >
                                {successMessage}
                            </div>

                        )
                    }

                    {
                        errorMessage && (

                            <div
                                style={{
                                    background: "#fee2e2",
                                    color: "#b91c1c",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    marginTop: "20px",
                                    marginBottom: "20px",
                                    fontWeight: "600"
                                }}
                            >
                                ❌ {errorMessage}
                            </div>

                        )
                    }

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
                                Tracking Number
                            </label>

                            <input
                                type="text"
                                name="tracking_number"
                                value={
                                    formData.tracking_number
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
                                Customer ID
                            </label>

                            <input
                                type="number"
                                name="customer_id"
                                value={
                                    formData.customer_id
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

                        <button
                            type="submit"
                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding:
                                    "12px 20px",
                                borderRadius:
                                    "10px",
                                cursor: "pointer"
                            }}
                        >
                            Create Parcel
                        </button>

                    </form>

               </MainLayout>
        </>
    );
}

export default CreateParcel;