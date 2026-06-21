import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function ChangePassword() {

    const navigate = useNavigate();

    const userId =
        localStorage.getItem("user_id");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword,
        setConfirmPassword] =
        useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "Passwords do not match"
            );

            return;
        }

        try {

            await api.patch(
                `/users/${userId}/change-password`,
                {
                    new_password:
                        newPassword
                }
            );

            alert(
                "Password Changed Successfully"
            );

            navigate("/");

        } catch (error) {

            alert(
                "Failed to change password"
            );
        }
    };

    return (

        <div>

            <h1>
                Change Password
            </h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                />

                <button type="submit">
                    Change Password
                </button>

            </form>

        </div>
    );
}

export default ChangePassword;