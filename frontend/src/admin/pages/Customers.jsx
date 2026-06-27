import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";

import { FiUsers, FiSearch } from "react-icons/fi";

function Customers() {

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

    const fetchCustomers = async () => {

        try {

            const response = await api.get(
                `/customers/?search=${search}`
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

}, [search]);

    return (
        <>
            <MainLayout>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <FiUsers
                                size={30}
                                color="#2563eb"
                            />

                            <h1>Customers</h1>

                        </div>

                    </div>

                    <div
                        style={{
                            marginBottom: "20px",
                            position: "relative",
                            width: "350px"
                        }}
                    >

                        <FiSearch
                            size={18}
                            color="#64748b"

                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "15px",
                                transform: "translateY(-50%)"
                            }}
                        />

                        <input
                            type="text"

                            placeholder="Search by name, phone or email..."

                            value={search}

                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            style={{
                                width: "100%",

                                padding: "12px 18px 12px 45px",

                                borderRadius: "12px",

                                border: "1px solid #d1d5db",

                                fontSize: "15px"
                            }}
                        />

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

                </MainLayout>
        </>
    );
}

export default Customers;