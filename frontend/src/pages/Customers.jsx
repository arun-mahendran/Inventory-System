import { useEffect, useState } from "react";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";
import { useNavigate } from "react-router-dom";

function Customers() {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);

    useEffect(() => {

        const fetchCustomers = async () => {

            try {

                const response = await api.get(
                    "/customers/"
                );

                setCustomers(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Customer Error:",
                    error
                );

            }

        };

        fetchCustomers();

    }, []);

    useEffect(() => {
    const fetchCustomers = async () => {
        try {

            const response = await api.get(
                "/customers/"
            );

            setCustomers(
                response.data
            );

        } catch (error) {

            console.error(
                "Customer Error:",
                error
            );

        }

    };

    fetchCustomers();

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

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}
                    >

                        <h1>
                            Customers
                        </h1>

                        <button
                            onClick={() =>
                                navigate("/create-customer")
                            }

                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "10px",
                                cursor: "pointer"
                            }}
                        >
                            + Add Customer
                        </button>

                    </div>

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "18px",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Name
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Phone
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Pincode
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Address
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {customers.map((customer) => (

                                    <tr
                                        key={customer.id}
                                        className="table-row"
                                    >

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {customer.customer_name}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {customer.phone}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {customer.pincode}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {customer.address}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </PageContainer>

            </div>
        </>
    );
}

export default Customers;