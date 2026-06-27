import { useState } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import { toast } from "react-toastify";

import {
    FiUploadCloud,
    FiFileText
} from "react-icons/fi";

function BulkImport() {

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [result, setResult] =
        useState(null);

    const handleFileChange = (e) => {

        setSelectedFile(
            e.target.files[0]
        );

    };

    const handleUpload = async () => {

        if (!selectedFile) {

            toast.error(
                "Please select an Excel file"
            );

            return;
        }

        const formData = new FormData();

        formData.append(
            "file",
            selectedFile
        );

        try {

            const response =
                await api.post(
                    "/bulk-import/",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

            setResult(
                response.data
            );

            if (
                response.data.imported > 0 &&
                response.data.skipped === 0
            ) {

                toast.success(
                    `Successfully imported ${response.data.imported} parcels`
                );

            }

            else if (
                response.data.imported > 0 &&
                response.data.skipped > 0
            ) {

                toast.warning(
                    `${response.data.imported} imported, ${response.data.skipped} skipped`
                );

            }

            else if (
                response.data.imported === 0 &&
                response.data.skipped > 0
            ) {

                toast.error(
                    `All rows skipped. Duplicate tracking numbers found`
                );

            }

        }

        catch (error) {

            console.log(error);

            toast.error(
                "Bulk import failed"
            );

        }

    };

    return (

        <MainLayout>

            <div
                style={{
                    maxWidth: "700px",
                    margin: "0 auto"
                }}
            >

                <h1
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "30px"
                    }}
                >

                    <FiUploadCloud
                        size={35}
                        color="#2563eb"
                    />

                    Bulk Parcel Import

                </h1>

                <div
                    style={{
                        background: "white",
                        padding: "35px",
                        borderRadius: "20px",
                        boxShadow:
                            "0 10px 25px rgba(0,0,0,0.08)"
                    }}
                >

                    <div
                        style={{
                            border:
                                "2px dashed #cbd5e1",

                            borderRadius: "18px",

                            padding: "50px",

                            textAlign: "center",

                            background: "#f8fafc"
                        }}
                    >

                        <FiFileText
                            size={55}
                            color="#64748b"
                        />

                        <h3>
                            Upload Excel File
                        </h3>

                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >
                            Upload .xlsx file containing parcel details
                        </p>

                        <input
                            type="file"

                            accept=".xlsx"

                            onChange={
                                handleFileChange
                            }

                            style={{
                                marginTop: "20px"
                            }}
                        />

                        {
                            selectedFile && (

                                <p
                                    style={{
                                        marginTop: "15px",
                                        color: "#2563eb",
                                        fontWeight: "600"
                                    }}
                                >

                                    Selected:
                                    {" "}
                                    {
                                        selectedFile.name
                                    }

                                </p>

                            )
                        }

                    </div>

                    <button
                        onClick={handleUpload}

                        style={{
                            width: "100%",

                            marginTop: "25px",

                            background: "#2563eb",

                            color: "white",

                            border: "none",

                            padding: "15px",

                            borderRadius: "14px",

                            fontSize: "16px",

                            fontWeight: "600",

                            cursor: "pointer"
                        }}
                    >

                        Import Parcels

                    </button>

                </div>

                {
                    result && (

                        <div
                            style={{
                                background: "white",

                                padding: "25px",

                                marginTop: "25px",

                                borderRadius: "18px",

                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)"
                            }}
                        >

                            <h3>
                                Import Summary
                            </h3>

                            <p>
                                Total Rows:
                                {" "}
                                {result.total_rows}
                            </p>

                            <p>
                                Imported:
                                {" "}
                                {result.imported}
                            </p>

                            <p>
                                Skipped:
                                {" "}
                                {result.skipped}
                            </p>

                            {
                                result.errors.length > 0 && (

                                    <>
                                        <h4>
                                            Errors
                                        </h4>

                                        <ul>

                                            {
                                                result.errors.map(
                                                    (
                                                        error,
                                                        index
                                                    ) => (

                                                        <li
                                                            key={index}
                                                        >
                                                            {error}
                                                        </li>

                                                    )
                                                )
                                            }

                                        </ul>

                                    </>

                                )
                            }

                        </div>

                    )
                }

            </div>

        </MainLayout>

    );

}

export default BulkImport;