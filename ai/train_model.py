#!/usr/bin/env python
from ml_module import train_and_save_model

if __name__ == "__main__":
    print("Starting ML Model training...")
    model = train_and_save_model()
    print("ML Model training completed successfully. Model saved as 'student_model.pkl'.")
