import json
import random
from datetime import datetime

def generate_geospatial_data():
    # Target coordinates for our three primary research zones
    # Target coordinates for our primary research zones
    regions = [
        {"id": "amazon_basin", "name": "Amazon Rainforest", "lat": -3.4653, "lng": -62.2159, "type": "deforestation"},
        {"id": "indian_ocean", "name": "Indian Ocean Basin", "lat": -10.2145, "lng": 73.1256, "type": "coral_bleaching"},
        {"id": "new_delhi", "name": "New Delhi NCR", "lat": 28.6139, "lng": 77.2090, "type": "urban_sprawl"},
        {"id": "italy_riva", "name": "Riva del Garda", "lat": 45.8845, "lng": 10.8414, "type": "water_level_fluctuation"}
    ]

    payload = []
    
    print("Initializing Orbital Watchdog AI Pipeline...")
    
    for region in regions:
        # Simulating the confidence score of an AI analyzing satellite changes
        anomaly_score = round(random.uniform(0.75, 0.98), 2)
        
        # Simulating a percentage drop (e.g., loss of trees or water)
        current_metric = round(100 - (anomaly_score * 35), 1) 
        
        data_point = {
            "region_id": region["id"],
            "region_name": region["name"],
            "coordinates": {"lat": region["lat"], "lng": region["lng"]},
            "analysis_type": region["type"],
            "timestamp": datetime.now().isoformat(),
            "telemetry": {
                "baseline_2016_index": 100.0,
                "current_2026_index": current_metric,
                "ai_confidence_score": anomaly_score
            },
            "ai_insight": f"[ALERT] Significant {region['type'].replace('_', ' ')} detected at [{region['lat']}, {region['lng']}]. Confidence interval: {anomaly_score * 100}%. Immediate review recommended."
        }
        payload.append(data_point)
        print(f"--> Processed multi-modal analysis for: {region['name']}")

    # Outputting the payload for the Node API to consume
    with open("geo_state.json", "w") as f:
        json.dump(payload, f, indent=4)
    
    print("\nSUCCESS: Geospatial payload secured in geo_state.json")

if __name__ == "__main__":
    generate_geospatial_data()