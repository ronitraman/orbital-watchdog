# 🛰️ Orbital Watchdog

**Multi-Modal AI Geospatial Reconnaissance Platform**

Orbital Watchdog is a decoupled, full-stack telemetry architecture designed to simulate the ingestion, analysis, and visualization of Earth observation data. It processes simulated multi-modal AI anomaly reports and renders them on an interactive Geographic Information System (GIS) dashboard.

## 🏗️ System Architecture

This project is built using a strict three-tier microservice architecture:
1. **Data Ingestion Engine (Python):** Simulates the extraction of raster data and generates structural JSON matrices representing AI confidence scores and environmental changes (e.g., deforestation, water depletion).
2. **API Gateway (Node.js/Express):** A dedicated backend server that securely hosts the geospatial payload and handles Cross-Origin Resource Sharing (CORS) for the frontend.
3. **Analytical Dashboard (React.js + Vite):** A highly optimized, responsive UI that polls the API gateway, parses the telemetry, and dynamically controls a reactive Leaflet/ESRI satellite map based on active state.

## 🚀 Tech Stack
* **Frontend:** React, Vite, Lucide-React (Icons)
* **Geospatial Rendering:** Leaflet, React-Leaflet, ESRI ArcGIS World Imagery
* **Backend API:** Node.js, Express, CORS
* **Data Pipeline:** Python 3

## ⚙️ Local Deployment Instructions

To run this architecture on your local machine, you must boot the services independently.

**1. Generate the Telemetry Payload (Python)**
```bash
cd backend-python
python engine.py