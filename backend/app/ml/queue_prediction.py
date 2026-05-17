from datetime import datetime
import numpy as np

class QueuePredictor:
    def predict_wait_time(self, current_queue_length, office_category, current_time=None):
        """
        Predicts wait time based on queue length and office type.
        In a real scenario, this would use a trained model on historical data.
        """
        if current_time is None:
            current_time = datetime.now()
            
        hour = current_time.hour
        
        # Base time per person in minutes
        base_times = {
            "Bank": 12,
            "Government": 20,
            "Public Service": 15
        }
        
        base_time = base_times.get(office_category, 15)
        
        # Peak hour multiplier (Lunch time 1 PM - 3 PM, Morning rush 10 AM - 11 AM)
        multiplier = 1.0
        if 13 <= hour <= 15:
            multiplier = 1.5
        elif 10 <= hour <= 11:
            multiplier = 1.3
        elif hour >= 17:
            multiplier = 0.8 # Closing time, faster service
            
        predicted_time = current_queue_length * base_time * multiplier
        return round(predicted_time)

    def suggest_best_time(self, office_category):
        """
        Suggests the best time to visit based on typical trends.
        """
        # Usually early morning or late afternoon is best
        return ["09:00 AM", "04:30 PM"]

queue_predictor = QueuePredictor()
