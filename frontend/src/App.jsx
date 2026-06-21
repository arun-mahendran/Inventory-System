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
                element={<Dashboard />}
            />

            <Route
                path="/customers"
                element={<Customers />}
            />

            <Route
                path="/delivery-agents"
                element={
                    <DeliveryAgents />
                }
            />

            <Route
                path="/parcels"
                element={<Parcels />}
            />

            <Route
                path="/create-parcel"
                element={
                    <CreateParcel />
                }
            />

            <Route
                path="/tracking"
                element={<Tracking />}
            />

            <Route
                path="/parcel-history/:id"
                element={
                    <ParcelHistory />
                }
            />

            <Route
                path="/create-agent"
                element={<CreateAgent />}
            />

            <Route
                path="/change-password"
                element={<ChangePassword />}
            />

            <Route
                path="/create-customer"
                element={<CreateCustomer />}
            />

        </Routes>
    );
}

export default App;