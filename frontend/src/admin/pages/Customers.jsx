import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";

import "../../styles/customers.css";

import { FiUsers, FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AVATAR_TONES = 5;

const Shimmer = ({ width = "100%", height = "16px", radius = "8px", style = {} }) => (
    <div
        className="skeleton-shimmer"
        style={{
            width,
            height,
            borderRadius: radius,
            background: "#e5e7eb",
            position: "relative",
            overflow: "hidden",
            ...style,
        }}
    />
);

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Customers() {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 10;

    useEffect(() => {

        const fetchCustomers = async () => {

            setLoading(true);

            try {

                const response = await api.get(
                    `/customers/?search=${search}`
                );

                const sortedCustomers = response.data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setCustomers(sortedCustomers);
                setPage(1); // reset to first page whenever the search changes

            } catch (error) {

                console.error("Customer Error:", error);

            } finally {

                setLoading(false);

            }

        };

        // small debounce so we're not firing a request on every keystroke
        const timeout = setTimeout(fetchCustomers, 300);

        return () => clearTimeout(timeout);

    }, [search]);

    const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
    const pagedCustomers = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goToPage = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setPage(nextPage);
    };

    return (
        <MainLayout>

            <style>{`
                .skeleton-shimmer::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(
                        90deg,
                        rgba(255,255,255,0) 0%,
                        rgba(255,255,255,0.6) 50%,
                        rgba(255,255,255,0) 100%
                    );
                    animation: skeleton-shimmer 1.4s infinite;
                }
                @keyframes skeleton-shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>

            <div className="customers-page">

                {/* Header */}

                <div className="customers-header">

                    <div className="customers-heading">
                        <span className="customers-icon"><FiUsers /></span>
                        <div>
                            <h1>Customers</h1>
                            <p className="customers-subtitle">Manage and view all registered customers</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn-solid-accent"
                        onClick={() => navigate("/create-customer")}
                    >
                        <FiPlus /> Add Customer
                    </button>

                </div>

                {/* Toolbar */}

                <div className="customers-toolbar">

                    <div className="customers-search">
                        <FiSearch className="customers-search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, phone or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {!loading && (
                        <p className="customers-count">
                            <strong>{customers.length}</strong> customer{customers.length === 1 ? "" : "s"}
                        </p>
                    )}

                </div>

                {/* Table */}

                <div className="customers-card">

                    {loading ? (
                        <table className="customers-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Pincode</th>
                                    <th>Address</th>
                                </tr>
                            </thead>

                            <tbody>
                                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                    <tr key={`skeleton-${i}`}>

                                        <td>
                                            <div className="customer-name-cell" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <Shimmer width="36px" height="36px" radius="50%" />
                                                <Shimmer width="120px" height="14px" />
                                            </div>
                                        </td>

                                        <td>
                                            <Shimmer width="100px" height="14px" />
                                        </td>

                                        <td>
                                            <Shimmer width="70px" height="20px" radius="20px" />
                                        </td>

                                        <td>
                                            <Shimmer width="180px" height="14px" />
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    ) : customers.length === 0 ? (
                        <p className="customers-empty">No customers found.</p>
                    ) : (
                        <table className="customers-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Pincode</th>
                                    <th>Address</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pagedCustomers.map((customer, index) => (
                                    <tr key={customer.id}>

                                        <td>
                                            <div className="customer-name-cell">
                                                <span className={`customer-avatar avatar-tone-${index % AVATAR_TONES}`}>
                                                    {getInitials(customer.customer_name)}
                                                </span>
                                                <span className="customer-name">{customer.customer_name}</span>
                                            </div>
                                        </td>

                                        <td>{customer.phone}</td>

                                        <td>
                                            <span className="customer-pincode">{customer.pincode}</span>
                                        </td>

                                        <td className="customer-address">{customer.address}</td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}

                </div>

                {/* Pagination */}

                {!loading && customers.length > PAGE_SIZE && (
                    <div className="customers-pagination">

                        <button
                            type="button"
                            className="pagination-btn"
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                        >
                            <FiChevronLeft /> Previous
                        </button>

                        <span className="pagination-info">
                            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                        </span>

                        <button
                            type="button"
                            className="pagination-btn"
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next <FiChevronRight />
                        </button>

                    </div>
                )}

            </div>

        </MainLayout>
    );
}

export default Customers;