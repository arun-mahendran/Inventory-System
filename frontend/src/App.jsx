import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

//import { useState } from "react";

import Login from "./pages/Login";
import Dashboard
from "./admin/pages/Dashboard";

import Customers
from "./admin/pages/Customers";

import DeliveryAgents
from "./admin/pages/DeliveryAgents";

import Parcels
from "./admin/pages/Parcels";

import Tracking
from "./admin/pages/Tracking";

import CreateAgent 
from "./admin/pages/CreateAgent";

import CreateCustomer 
from "./admin/pages/CreateCustomer";

import CreateParcel 
from "./admin/pages/CreateParcel";

import ParcelHistory 
from "./admin/pages/ParcelHistory";

import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./components/ProtectedRoute";

import AgentDashboard from "./agent/pages/AgentDashboard";

import MyParcels from "./agent/pages/MyParcels";

import AgentTracking
from "./agent/pages/AgentTracking";

import AgentDeliveryHistory
from "./agent/pages/AgentDeliveryHistory";

import AIAssistant
from "./admin/pages/AIAssistant";

import Analytics from "./admin/pages/Analytics";

import Reports from "./admin/pages/Reports";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import SessionTimeout from "./components/SessionTimeout";

import BulkImport from "./admin/pages/BulkImport";

import PendingDeliveriesPage from "./agent/pages/PendingDeliveriesPage";

function App() {

    //const [sidebarOpen, setSidebarOpen] =
        //useState(true);
    
    return (

        <>
        <SessionTimeout />
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
                path="/ai-assistant"
                element={
                    <ProtectedRoute>

                        <AIAssistant />

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

            <Route
                path="/agent-dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={
                            ["DeliveryAgent"]
                        }
                    >

                        <AgentDashboard />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-parcels"
                element={
                    <ProtectedRoute
                        allowedRoles={
                            ["DeliveryAgent"]
                        }
                    >

                        <MyParcels />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/agent-tracking"
                element={
                    <ProtectedRoute
                        allowedRoles={["DeliveryAgent"]}
                    >
                        <AgentTracking />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/delivery-history"
                element={
                    <ProtectedRoute
                        allowedRoles={
                            ["DeliveryAgent"]
                        }
                    >
                        <AgentDeliveryHistory />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>

                        <Analytics />

                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={<Reports />}
            />

            <Route
                path="/bulk-import"
                element={<BulkImport />}
            />

            <Route
                path="/agent/pending-deliveries"
                element={<PendingDeliveriesPage />}
            />

        </Routes>

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"

            toastStyle={{
                borderRadius: "14px",
                fontWeight: "600",
                fontSize: "15px"
            }}
        />

        </>

        
    );
}

export default App;