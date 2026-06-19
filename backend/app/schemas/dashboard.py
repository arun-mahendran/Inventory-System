from pydantic import BaseModel

class DashboardSummary(BaseModel):
    total_customers: int
    total_parcels: int
    received_parcels: int
    assigned_parcels: int
    out_for_delivery_parcels: int
    delivered_parcels: int
    failed_parcels: int
    available_agents: int
    busy_agents: int


class AgentPerformance(BaseModel):
    agent_id: int
    agent_name: str
    active_parcels: int
    delivered_parcels: int
    failed_parcels: int
    success_rate: float


class TopAgent(BaseModel):
    agent_id: int
    agent_name: str
    delivered_parcels: int
    success_rate: float


class WorstAgent(BaseModel):
    agent_id: int
    agent_name: str
    failed_parcels: int
    success_rate: float


class DeliveryMetrics(BaseModel):
    total_completed: int
    delivered_parcels: int
    failed_parcels: int
    success_rate: float
    failure_rate: float
