from ultralytics import YOLO
import cv2
import numpy as np
from app.core.config import settings
import os

class CrowdDetector:
    def __init__(self, model_path=settings.MODEL_PATH):
        if os.path.exists(model_path):
            self.model = YOLO(model_path)
        else:
            print(f"Model path {model_path} not found. Using default yolov8n.pt")
            self.model = YOLO('yolov8n.pt')

    def detect_crowd(self, image_path_or_frame):
        """
        Detects people in a frame and returns the count and crowd level.
        """
        results = self.model(image_path_or_frame, classes=[0]) # Class 0 is 'person' in COCO
        
        person_count = 0
        for result in results:
            person_count += len(result.boxes)
            
        crowd_level = "low"
        if person_count > 20:
            crowd_level = "high"
        elif person_count > 10:
            crowd_level = "medium"
            
        return person_count, crowd_level

crowd_detector = CrowdDetector()
