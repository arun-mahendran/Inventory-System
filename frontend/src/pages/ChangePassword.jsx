import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import { FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Minimum password length validation
    if (newPassword.length < 8) {
      setPasswordError("Password must contain at least 8 characters");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      await api.patch(`/users/${userId}/change-password`, {
        new_password: newPassword,
      });

      toast.success("Password changed successfully!");

      localStorage.setItem("change_password", "false");

      const role = localStorage.getItem("role");

      setTimeout(() => {
        if (role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/agent-dashboard");
        }
      }, 2000);
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #2563eb 100%)",
      }}
    >
      <div
        style={{
          width: "480px",

          background: "rgba(255,255,255,0.95)",

          backdropFilter: "blur(12px)",

          padding: "45px",

          borderRadius: "30px",

          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",

          border: "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",

              borderRadius: "50%",

              background: "linear-gradient(135deg,#2563eb,#3b82f6)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              margin: "0 auto 20px auto",
            }}
          >
            <FiShield size={40} color="white" />
          </div>

          <h1
            style={{
              marginBottom: "10px",
              color: "#0f172a",
            }}
          >
            Change Password
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Please change your temporary password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              New Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <FiLock
                size={18}
                color="#64748b"
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  const password = e.target.value;

                  setNewPassword(password);

                  if (password.length > 0 && password.length < 8) {
                    setPasswordError(
                      "Password must contain at least 8 characters",
                    );
                  } else {
                    setPasswordError("");
                  }
                }}
                required
                style={{
                  width: "100%",

                  padding: "14px 50px 14px 45px",

                  borderRadius: "14px",

                  border: passwordError
                    ? "2px solid #ef4444"
                    : "2px solid #e2e8f0",

                  fontSize: "15px",

                  boxSizing: "border-box",

                  outline: "none",

                  transition: "all 0.3s ease",
                }}
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",

                  cursor: "pointer",

                  color: "#64748b",
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            {passwordError && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "14px",
                  marginTop: "8px",
                  marginBottom: 0,
                  fontWeight: "500",
                }}
              >
                {passwordError}
              </p>
            )}
          </div>

          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Confirm Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <FiLock
                size={18}
                color="#64748b"
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",

                  padding: "14px 50px 14px 45px",

                  borderRadius: "14px",

                  border: "2px solid #e2e8f0",

                  fontSize: "15px",

                  boxSizing: "border-box",

                  transition: "all 0.3s ease",
                }}
              />

              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",

                  cursor: "pointer",

                  color: "#64748b",
                }}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
            style={{
              width: "100%",

              padding: "15px",

              background: "linear-gradient(135deg,#2563eb,#3b82f6)",

              color: "white",

              border: "none",

              borderRadius: "14px",

              fontSize: "16px",

              fontWeight: "600",

              cursor: "pointer",

              boxShadow: "0 12px 25px rgba(37,99,235,0.3)",

              transition: "all 0.3s ease",
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
