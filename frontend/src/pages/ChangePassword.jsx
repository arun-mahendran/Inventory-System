import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/change-password.css";

import { FiLock, FiEye, FiEyeOff, FiShield, FiCheck, FiAlertCircle } from "react-icons/fi";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef(null);
  const btnRef = useRef(null);

  const hasMinLength = newPassword.length >= 8;
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleCardMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
  };

  const handleBtnMove = (e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleBtnLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

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

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cp-page">
      <div
        className="cp-card"
        ref={cardRef}
        onMouseMove={handleCardMove}
      >
        <div className="card-spotlight" />

        <div className="cp-manifest-id">
          SECURITY <span>#REQ-772</span>
        </div>

        <div className="cp-header">
          <div className="cp-badge">
            <FiShield size={30} color="white" />
          </div>

          <div className="cp-eyebrow">Account Security</div>

          <h1>Change Password</h1>

          <p className="cp-sub">
            Please change your temporary password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={newPassword}
              className={passwordError ? "has-error" : ""}
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
            />

            <label>New Password</label>

            <FiLock className="input-icon" />

            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className={"icon-swap" + (showPassword ? " is-visible" : "")}>
                <FiEye className="i-eye" />
                <FiEyeOff className="i-eye-off" />
              </span>
            </button>
          </div>

          {passwordError && (
            <p className="field-error">
              <FiAlertCircle size={14} />
              {passwordError}
            </p>
          )}

          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>

            <FiLock className="input-icon" />

            <button
              type="button"
              className="password-toggle"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <span
                className={"icon-swap" + (showConfirmPassword ? " is-visible" : "")}
              >
                <FiEye className="i-eye" />
                <FiEyeOff className="i-eye-off" />
              </span>
            </button>
          </div>

          <div className="cp-requirements">
            <div className={"cp-req" + (hasMinLength ? " met" : "")}>
              <span className="req-dot">
                <FiCheck />
              </span>
              At least 8 characters
            </div>

            <div className={"cp-req" + (passwordsMatch ? " met" : "")}>
              <span className="req-dot">
                <FiCheck />
              </span>
              Passwords match
            </div>
          </div>

          <button
            type="submit"
            className="cp-btn"
            ref={btnRef}
            disabled={isSubmitting}
            onMouseMove={handleBtnMove}
            onMouseLeave={handleBtnLeave}
          >
            {isSubmitting && <span className="btn-spinner" />}
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;