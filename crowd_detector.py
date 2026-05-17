import cv2
from ultralytics import YOLO
import requests
import time
import argparse

# Configuration
API_URL = "http://localhost:8000/api/v1/admin/office"
# Change this to your office ID from the admin panel
OFFICE_ID = "replace-with-your-office-id" 

def start_detection(office_id, token):
    # Load the YOLOv8 model
    model = YOLO('yolov8n.pt')  # It will use your local yolov8n.pt
    
    # Open webcam
    cap = cv2.VideoCapture(0)
    
    print(f"Starting Crowd Detection for Office: {office_id}")
    print("Press 'q' to quit")

    last_sync_time = time.time()
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Run YOLOv8 detection
        results = model(frame, classes=[0], conf=0.5, verbose=False) # class 0 is 'person'
        
        # Count persons
        count = len(results[0].boxes)
        
        # Draw results on frame
        annotated_frame = results[0].plot()
        
        # Display count on screen
        cv2.putText(annotated_frame, f"People Count: {count}", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        cv2.imshow("AI Crowd Detector", annotated_frame)

        # Sync with database every 5 seconds
        if time.time() - last_sync_time > 5:
            try:
                headers = {"Authorization": f"Bearer {token}"}
                response = requests.post(
                    f"{API_URL}/{office_id}/crowd", 
                    params={"count": count},
                    headers=headers
                )
                if response.status_code == 200:
                    print(f"Synced: {count} people detected.")
                else:
                    print(f"Sync failed: {response.status_code}")
            except Exception as e:
                print(f"Connection error: {e}")
            
            last_sync_time = time.time()

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    print("Crowd Detection System Initializing...")
    # You would pass your Admin Token here
    # For now, I'm setting up the structure.
    # To run: python crowd_detector.py --id YOUR_OFFICE_ID --token YOUR_TOKEN
    parser = argparse.ArgumentParser()
    parser.add_argument("--id", required=True, help="Office ID")
    parser.add_argument("--token", required=True, help="Admin Auth Token")
    args = parser.parse_args()
    
    start_detection(args.id, args.token)
