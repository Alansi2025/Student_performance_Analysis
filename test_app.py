#!/usr/bin/env python
import os
import unittest
from database import engine, Base, SessionLocal
import models
import ml_module
import ai_module
from app import app

class TestStudentPerformanceSystem(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()
        self.db = SessionLocal()
        
    def tearDown(self):
        self.db.close()
        
    def test_database_connection(self):
        """Verifies database connection is active and tables are created"""
        # Check if users table exists by querying
        user_count = self.db.query(models.User).count()
        self.assertGreaterEqual(user_count, 0)
        print(f"[SUCCESS] Database connected successfully. Current seeded users count: {user_count}")
        
    def test_ml_prediction(self):
        """Verifies Scikit-learn Random Forest model can make predictions"""
        # Try predicting for a high performing student (100% attendance, 20 hrs study, 95% avg grade)
        high_perf = ml_module.predict_performance(100.0, 20.0, 95.0)
        self.assertGreaterEqual(high_perf['predicted_gpa'], 3.0)
        self.assertEqual(high_perf['risk_level'], 'Low')
        
        # Try predicting for a struggling student (55% attendance, 2 hrs study, 45% avg grade)
        low_perf = ml_module.predict_performance(55.0, 2.0, 45.0)
        self.assertLessEqual(low_perf['predicted_gpa'], 2.5)
        self.assertEqual(low_perf['risk_level'], 'High')
        
        print(f"[SUCCESS] ML GPA & Risk Predictions function correctly.")
        print(f"          - High Perf GPA: {high_perf['predicted_gpa']} (Risk: {high_perf['risk_level']})")
        print(f"          - Low Perf GPA: {low_perf['predicted_gpa']} (Risk: {low_perf['risk_level']})")

    def test_ai_module_fallback(self):
        """Verifies AI mascot advice generation falls back gracefully"""
        advice = ai_module.generate_student_recommendations("Alex", 3.8, "Low", 95, 15)
        self.assertIsNotNone(advice)
        self.assertTrue(len(advice) > 0)
        print(f"[SUCCESS] AI Module advice generation verified. Sample output: '{advice[:60]}...'")

    def test_flask_endpoints(self):
        """Verifies main web routes return correct status codes"""
        # Test Redirect from Home
        response = self.client.get('/')
        self.assertEqual(response.status_code, 302) # Redirect to Login
        
        # Test Login Page
        response = self.client.get('/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Academic Atelier", response.data)
        
        # Test unauthorized access to dashboards redirects
        response = self.client.get('/teacher')
        self.assertEqual(response.status_code, 302)
        
        response = self.client.get('/student')
        self.assertEqual(response.status_code, 302)
        
        # Test Login Session Simulation
        with self.client.session_transaction() as sess:
            # Mock session for Alex Sterling (seeded user)
            sess['user_id'] = 2 # Jane Doe or Alex Sterling
            sess['role'] = 'student'
            sess['user_name'] = 'Alex Sterling'
            
        response = self.client.get('/student')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Alex Sterling", response.data)
        self.assertIn(b"Student Portal", response.data)
        
        print("[SUCCESS] Flask endpoints and session authentication function correctly.")

if __name__ == "__main__":
    unittest.main()
