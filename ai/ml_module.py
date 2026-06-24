import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import logging

logger = logging.getLogger("MLModule")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "student_model.pkl")

def generate_synthetic_data(num_samples=1000):
    """Generates synthetic student performance data for training the model"""
    np.random.seed(42)
    
    # Features
    attendance = np.random.uniform(50, 100, num_samples)
    study_hours = np.random.uniform(2, 30, num_samples)
    avg_grade = np.random.uniform(40, 100, num_samples)
    sleep_hours = np.random.uniform(4, 10, num_samples)
    social_media_hours = np.random.uniform(0, 8, num_samples)
    exam_pressure = np.random.uniform(1, 10, num_samples)
    stress_level = np.random.uniform(1, 10, num_samples)
    
    # Target GPA: positive relation with attendance, study, sleep, avg_grade. Negative with social media, stress.
    noise = np.random.normal(0, 0.15, num_samples)
    gpa = 0.5 + 1.2 * (attendance / 100.0) + 0.6 * (study_hours / 30.0) + 1.2 * (avg_grade / 100.0) \
          + 0.3 * (sleep_hours / 10.0) - 0.2 * (social_media_hours / 8.0) - 0.2 * (stress_level / 10.0) + noise
    
    # Clip GPA between 0.0 and 4.0
    gpa = np.clip(gpa, 0.0, 4.0)
    
    df = pd.DataFrame({
        'attendance': attendance,
        'study_hours': study_hours,
        'avg_grade': avg_grade,
        'sleep_hours': sleep_hours,
        'social_media_hours': social_media_hours,
        'exam_pressure': exam_pressure,
        'stress_level': stress_level,
        'gpa': gpa
    })
    return df

def train_and_save_model():
    """Trains the Random Forest model on CSV data or synthetic data and saves it"""
    df = generate_synthetic_data()
    
    X = df[['attendance', 'study_hours', 'avg_grade', 'sleep_hours', 'social_media_hours', 'exam_pressure', 'stress_level']]
    y = df['gpa']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    logger.info(f"Model saved to {MODEL_PATH}")
    return model

def load_model():
    """Loads the trained model, or trains a new one if it doesn't exist"""
    if not os.path.exists(MODEL_PATH):
        logger.warning("Model file not found. Training a new model now...")
        return train_and_save_model()
    
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        logger.error(f"Error loading model: {e}. Retraining...")
        return train_and_save_model()

def predict_performance(attendance, study_hours, avg_grade, sleep_hours=7.5, social_media_hours=2.0, exam_pressure=5, stress_level=5):
    """
    Predicts student GPA and determines risk level based on student statistics.
    """
    # Always ensure model is up to date with new features for testing
    if os.path.exists(MODEL_PATH):
        try:
            model = load_model()
            if not hasattr(model, "n_features_in_") or model.n_features_in_ != 7:
                model = train_and_save_model()
        except:
            model = train_and_save_model()
    else:
        model = load_model()
    
    # Prepare input DataFrame with feature names to match training
    features = pd.DataFrame(
        [[attendance, study_hours, avg_grade, sleep_hours, social_media_hours, exam_pressure, stress_level]], 
        columns=['attendance', 'study_hours', 'avg_grade', 'sleep_hours', 'social_media_hours', 'exam_pressure', 'stress_level']
    )
    predicted_gpa = float(model.predict(features)[0])
    
    # Determine risk level
    if predicted_gpa >= 3.4:
        risk_level = "Low"
    elif predicted_gpa >= 2.5:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    # Standard recommendations
    recs = []
    if attendance < 85:
        recs.append("Improve attendance rate above 85% to keep track of lectures.")
    if study_hours < 8:
        recs.append("Increase self-study hours to at least 8-10 hours per week.")
    if sleep_hours < 6:
        recs.append("Increase sleep duration for better focus.")
    if stress_level > 7:
        recs.append("High stress levels detected; consider meeting with a counselor.")
    if not recs:
        recs.append("Maintain the excellent study schedule and healthy lifestyle.")
        
    return {
        'predicted_gpa': round(predicted_gpa, 2),
        'risk_level': risk_level,
        'recs': recs
    }
