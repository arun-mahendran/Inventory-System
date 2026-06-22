import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
//import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import DeliveryAgents from "./pages/DeliveryAgents";
import Parcels from "./pages/Parcels";
import CreateParcel from "./pages/CreateParcel";
import Tracking from "./pages/Tracking";
import ParcelHistory from "./pages/ParcelHistory";
import CreateAgent from "./pages/CreateAgent";
import ChangePassword from "./pages/ChangePassword";
import CreateCustomer from "./pages/CreateCustomer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    //const [sidebarOpen, setSidebarOpen] =
        //useState(true);
    
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>

                        <Dashboard />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/customers"
                element={
                    <ProtectedRoute>

                        <Customers />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/delivery-agents"
                element={
                    <ProtectedRoute>

                        <DeliveryAgents />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/parcels"
                element={
                    <ProtectedRoute>

                        <Parcels />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-parcel"
                element={
                    <ProtectedRoute>

                        <CreateParcel />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/tracking"
                element={
                    <ProtectedRoute>

                        <Tracking />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/parcel-history/:id"
                element={
                    <ProtectedRoute>

                        <ParcelHistory />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-agent"
                element={
                    <ProtectedRoute>

                        <CreateAgent />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/change-password"
                element={
                    <ProtectedRoute>

                        <ChangePassword />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-customer"
                element={
                    <ProtectedRoute>

                        <CreateCustomer />

                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;