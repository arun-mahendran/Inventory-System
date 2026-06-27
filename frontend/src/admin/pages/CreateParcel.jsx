import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";

import { toast } from "react-toastify";

function CreateParcel() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        tracking_number: "",

        customer_name: "",

        phone: "",

        email: "",

        address: "",

        pincode: "",

        amount: "",

        payment_method: "Prepaid"
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const paymentStatus =
            formData.payment_method ===
            "Prepaid"
                ? "Paid"
                : "Pending";

        try {

            await api.post(
            "/parcels/",
            {
                tracking_number:
                    formData.tracking_number,

                customer_name:
                    formData.customer_name,

                phone:
                    formData.phone,

                email:
                    formData.email,

                address:
                    formData.address,

                pincode:
                    formData.pincode,

                amount:
                    Number(formData.amount),

                payment_method:
                    formData.payment_method,

                payment_status:
                    paymentStatus
            }
        );

            toast.success(
                "Parcel Created Successfully"
            );

            setTimeout(() => {
                navigate("/parcels");
            }, 1500);

        } catch (error) {

            console.error(
                "Create Parcel Error:",
                error
            );

            toast.error(
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

                        <div style={{ marginBottom: "20px" }}>

    <label>Customer Name</label>

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

<div style={{ marginBottom: "20px" }}>

    <label>Phone</label>

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

<div style={{ marginBottom: "20px" }}>

    <label>Email</label>

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

<div style={{ marginBottom: "20px" }}>

    <label>Address</label>

    <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        rows={3}
        style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
        }}
    />

</div>

<div style={{ marginBottom: "20px" }}>

    <label>Pincode</label>

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

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label>
                                Amount (₹)
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
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
                                Payment Method
                            </label>

                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px"
                                }}
                            >

                                <option value="Prepaid">
                                    Prepaid
                                </option>

                                <option value="CashOnDelivery">
                                    Cash On Delivery
                                </option>

                            </select>
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