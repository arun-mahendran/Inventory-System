import { useState } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import { toast } from "react-toastify";

import { FiUploadCloud, FiFileText } from "react-icons/fi";

import {
  FiCheckCircle,
  FiXCircle,
  FiDatabase,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

function BulkImport() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [result, setResult] = useState(null);

  const [showSummary, setShowSummary] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file");

      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      const response = await api.post("/bulk-import/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);

      setShowSummary(true);

      if (response.data.imported > 0 && response.data.skipped === 0) {
        toast.success(
          `Successfully imported ${response.data.imported} parcels`,
        );
      } else if (response.data.imported > 0 && response.data.skipped > 0) {
        toast.warning(
          `${response.data.imported} imported, ${response.data.skipped} skipped`,
        );
      } else if (response.data.imported === 0 && response.data.skipped > 0) {
        toast.error(`All rows skipped. Duplicate tracking numbers found`);
      }
    } catch (error) {
      console.log(error);

      toast.error("Bulk import failed");
    }
  };

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <FiUploadCloud size={35} color="#2563eb" />
          Bulk Parcel Import
        </h1>

        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "18px",
              padding: "50px",
              textAlign: "center",
              background: "#f8fafc",
            }}
          >
            <FiFileText size={55} color="#64748b" />

            <h3>Upload Excel File</h3>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Upload .xlsx file containing parcel details
            </p>

            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              style={{
                marginTop: "20px",
              }}
            />

            {selectedFile && (
              <p
                style={{
                  marginTop: "15px",
                  color: "#2563eb",
                  fontWeight: "600",
                }}
              >
                Selected: {selectedFile.name}
              </p>
            )}
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
              cursor: "pointer",
            }}
          >
            Import Parcels
          </button>
        </div>
      </div>

      {showSummary && result && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",

              width: "460px",
              padding: "28px",

              borderRadius: "24px",

              boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "26px",
                  }}
                >
                  Import Summary
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    marginTop: "8px",
                  }}
                >
                  Bulk parcel import completed.
                </p>
              </div>

              <button
                onClick={() => setShowSummary(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FiX size={28} color="#64748b" />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FiDatabase size={20} color="#2563eb" />

                  <span
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Total Rows
                  </span>
                </div>

                <strong
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {result.total_rows}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FiCheckCircle size={20} color="#16a34a" />

                  <span
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Successfully Imported
                  </span>
                </div>

                <strong
                  style={{
                    fontSize: "18px",
                    color: "#16a34a",
                  }}
                >
                  {result.imported}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FiXCircle size={20} color="#dc2626" />

                  <span
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Skipped Rows
                  </span>
                </div>

                <strong
                  style={{
                    fontSize: "18px",
                    color: "#dc2626",
                  }}
                >
                  {result.skipped}
                </strong>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div
                style={{
                  marginTop: "25px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",

                    marginBottom: "12px",
                  }}
                >
                  <FiAlertTriangle color="#f59e0b" size={22} />

                  <h4
                    style={{
                      margin: 0,
                    }}
                  >
                    Import Issues
                  </h4>
                </div>

                {[...new Set(result.errors)].map((error, index) => (
                  <p
                    key={index}
                    style={{
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    • {error}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowSummary(false)}
              style={{
                width: "100%",
                marginTop: "30px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default BulkImport;
