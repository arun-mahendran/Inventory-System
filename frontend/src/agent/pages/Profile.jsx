import { useState, useRef } from "react";

import AgentLayout from "../components/AgentLayout";
import { useAgentProfile } from "../../context/AgentProfileContext";

import "../../styles/profile.css";

import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiTruck,
    FiShield,
    FiLock,
    FiCalendar,
    FiEdit2,
    FiCamera,
    FiBriefcase,
    FiHash,
    FiChevronRight,
    FiLogOut,
    FiUserX,
    FiUpload
} from "react-icons/fi";

function Profile() {

    const fileInputRef = useRef(null);

    const { photo, setPhoto } = useAgentProfile();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const agent = {
        name: "Arun Kumar",
        role: "Delivery Agent",
        agentId: "AGT-10025",
        status: "Active",
        email: "arun.kumar@email.com",
        phone: "+91 98765 43210",
        hub: "Sattur Hub",
        employeeId: "AGT-10025",
        joinedOn: "25 Jan 2024",
        fullName: "Arun Kumar",
        dob: "15 Aug 1998",
        gender: "Male",
        address: "123, Main Street, Sattur, Virudhunagar, Tamil Nadu - 626203",
        emergencyContact: "+91 91234 56789 (Ramesh Kumar)",
        vehicleType: "Bike",
        vehicleNumber: "TN 67 AB 1234",
        licenseNumber: "TN67 2021 123456",
        insuranceValidTill: "15 Dec 2026"
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPhoto(previewUrl);
        }
    };

    return (

        <AgentLayout>

            <div className="profile-page">

                {/* Header */}

                <div className="profile-header">
                    <h1>My Profile</h1>
                    <p className="profile-subtitle">Manage your personal information and account settings.</p>
                </div>

                <div className="profile-grid">

                    {/* Left column - avatar card */}

                    <div className="profile-card profile-card-left">

                        <div className="avatar-panel">

                            <div className="avatar-wrap">

                                <div className="avatar-circle">
                                    {photo ? (
                                        <img src={photo} alt="Profile" />
                                    ) : (
                                        <FiUser className="avatar-placeholder" />
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="avatar-upload-btn"
                                    onClick={handlePhotoClick}
                                    aria-label="Upload profile photo"
                                >
                                    <FiCamera />
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="avatar-input"
                                    onChange={handlePhotoChange}
                                />

                            </div>

                            <h2 className="overview-name">{agent.name}</h2>
                            <p className="overview-role">{agent.role}</p>
                            <span className="badge badge-status">{agent.status}</span>

                        </div>

                        <div className="photo-upload-block">
                            <p className="photo-upload-title">Profile Photo</p>
                            <p className="photo-upload-sub">JPG, PNG or GIF. Max size of 2MB.</p>

                            <button type="button" className="btn-outline btn-full" onClick={handlePhotoClick}>
                                <FiUpload /> Change Photo
                            </button>
                        </div>

                    </div>

                    {/* Right column */}

                    <div className="profile-right-col">

                        {/* Personal Information */}

                        <div className="profile-card">

                            <div className="card-header">
                                <h3>Personal Information</h3>
                                <button type="button" className="btn-outline btn-small">
                                    <FiEdit2 /> Edit
                                </button>
                            </div>

                            <div className="info-list">

                                <div className="list-row">
                                    <span className="row-icon icon-orange"><FiUser /></span>
                                    <div className="row-content">
                                        <p className="row-label">Full Name</p>
                                        <p className="row-value">{agent.fullName}</p>
                                    </div>
                                </div>

                                <div className="list-row">
                                    <span className="row-icon icon-blue"><FiMail /></span>
                                    <div className="row-content">
                                        <p className="row-label">Email</p>
                                        <p className="row-value">{agent.email}</p>
                                    </div>
                                </div>

                                <div className="list-row">
                                    <span className="row-icon icon-green"><FiPhone /></span>
                                    <div className="row-content">
                                        <p className="row-label">Phone</p>
                                        <p className="row-value">{agent.phone}</p>
                                    </div>
                                </div>

                                <div className="list-row">
                                    <span className="row-icon icon-purple"><FiBriefcase /></span>
                                    <div className="row-content">
                                        <p className="row-label">Role</p>
                                        <span className="badge badge-role">{agent.role}</span>
                                    </div>
                                </div>

                                <div className="list-row">
                                    <span className="row-icon icon-blue-light"><FiHash /></span>
                                    <div className="row-content">
                                        <p className="row-label">Employee ID</p>
                                        <p className="row-value">{agent.employeeId}</p>
                                    </div>
                                </div>

                                <div className="list-row">
                                    <span className="row-icon icon-blue-light"><FiMapPin /></span>
                                    <div className="row-content">
                                        <p className="row-label">Hub</p>
                                        <p className="row-value">{agent.hub}</p>
                                    </div>
                                </div>

                                <div className="list-row">
                                    <span className="row-icon icon-orange"><FiCalendar /></span>
                                    <div className="row-content">
                                        <p className="row-label">Joined On</p>
                                        <p className="row-value">{agent.joinedOn}</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Security */}

                        <div className="profile-card">

                            <div className="card-header">
                                <h3>Security</h3>
                            </div>

                            <div className="info-list">

                                <div className="list-row list-row-action">
                                    <span className="row-icon icon-blue"><FiLock /></span>
                                    <div className="row-content">
                                        <p className="row-label row-label-strong">Change Password</p>
                                        <p className="row-sub">Update your password regularly to keep your account secure.</p>
                                    </div>
                                    <button type="button" className="btn-outline-accent">
                                        Change Password <FiChevronRight />
                                    </button>
                                </div>

                                <div className="list-row list-row-action">
                                    <span className="row-icon icon-green-soft"><FiShield /></span>
                                    <div className="row-content">
                                        <p className="row-label row-label-strong">Two-Factor Authentication</p>
                                        <p className="row-sub">Add extra security to your account</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`toggle-switch ${twoFactorEnabled ? "toggle-on" : ""}`}
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        aria-pressed={twoFactorEnabled}
                                        aria-label="Toggle two factor authentication"
                                    >
                                        <span className="toggle-knob" />
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Additional Details */}

                <div className="profile-card">

                    <div className="card-header">
                        <h3>Additional Details</h3>
                        <button type="button" className="btn-outline btn-small">
                            <FiEdit2 /> Edit
                        </button>
                    </div>

                    <div className="info-list info-list-columns">

                        <div className="list-row">
                            <span className="row-icon icon-orange"><FiCalendar /></span>
                            <div className="row-content">
                                <p className="row-label">Date of Birth</p>
                                <p className="row-value">{agent.dob}</p>
                            </div>
                        </div>

                        <div className="list-row">
                            <span className="row-icon icon-purple"><FiUser /></span>
                            <div className="row-content">
                                <p className="row-label">Gender</p>
                                <p className="row-value">{agent.gender}</p>
                            </div>
                        </div>

                        <div className="list-row">
                            <span className="row-icon icon-blue-light"><FiMapPin /></span>
                            <div className="row-content">
                                <p className="row-label">Address</p>
                                <p className="row-value">{agent.address}</p>
                            </div>
                        </div>

                        <div className="list-row">
                            <span className="row-icon icon-green"><FiPhone /></span>
                            <div className="row-content">
                                <p className="row-label">Emergency Contact</p>
                                <p className="row-value">{agent.emergencyContact}</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Vehicle Information */}

                <div className="profile-card">

                    <div className="card-header">
                        <h3>Vehicle Information</h3>
                        <button type="button" className="btn-outline btn-small">
                            <FiEdit2 /> Edit
                        </button>
                    </div>

                    <div className="info-list info-list-columns">

                        <div className="list-row">
                            <span className="row-icon icon-purple"><FiTruck /></span>
                            <div className="row-content">
                                <p className="row-label">Vehicle Type</p>
                                <p className="row-value">{agent.vehicleType}</p>
                            </div>
                        </div>

                        <div className="list-row">
                            <span className="row-icon icon-blue"><FiHash /></span>
                            <div className="row-content">
                                <p className="row-label">Vehicle Number</p>
                                <p className="row-value">{agent.vehicleNumber}</p>
                            </div>
                        </div>

                        <div className="list-row">
                            <span className="row-icon icon-orange"><FiHash /></span>
                            <div className="row-content">
                                <p className="row-label">License Number</p>
                                <p className="row-value">{agent.licenseNumber}</p>
                            </div>
                        </div>

                        <div className="list-row">
                            <span className="row-icon icon-green"><FiCalendar /></span>
                            <div className="row-content">
                                <p className="row-label">Insurance Valid Till</p>
                                <p className="row-value">{agent.insuranceValidTill}</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Account Actions */}

                <div className="profile-card">

                    <div className="card-header">
                        <h3>Account Actions</h3>
                    </div>

                    <div className="info-list info-list-columns">

                        <div className="list-row list-row-action">
                            <span className="row-icon icon-red-soft"><FiLogOut /></span>
                            <div className="row-content">
                                <p className="row-label row-label-strong">Logout from All Devices</p>
                                <p className="row-sub">Sign out from all active sessions</p>
                            </div>
                            <FiChevronRight className="row-chevron" />
                        </div>

                        <div className="list-row list-row-action">
                            <span className="row-icon icon-red-soft"><FiUserX /></span>
                            <div className="row-content">
                                <p className="row-label row-label-strong">Deactivate Account</p>
                                <p className="row-sub">Temporarily deactivate your account</p>
                            </div>
                            <FiChevronRight className="row-chevron" />
                        </div>

                    </div>

                </div>

            </div>

        </AgentLayout>

    );

}

export default Profile;