import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import DeliveryAgents from "./pages/DeliveryAgents";
import Parcels from "./pages/Parcels";
import CreateParcel from "./pages/CreateParcel";
import Tracking from "./pages/Tracking";
import ParcelHistory from "./pages/ParcelHistory";

function App() {
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

        </Routes>
    );
}

export default App;