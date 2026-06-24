import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'teacher' or 'student'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    courses_taught = relationship("Course", back_populates="teacher")
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    roll_no = Column(String(50), unique=True, index=True, nullable=False)
    admin_no = Column(String(50), unique=True, index=True, nullable=False)
    parent_name = Column(String(100), nullable=False)
    parent_phone = Column(String(20), nullable=False)
    class_name = Column(String(50), nullable=False)
    school_name = Column(String(150), nullable=False)
    school_board = Column(String(100), nullable=True, default="Standard Board")
    
    # Performance raw statistics (used by ML model)
    attendance_rate = Column(Float, default=90.0)  # Percentage 0-100
    study_hours_per_week = Column(Float, default=10.0) # Hours
    
    # Lifestyle and Stress statistics
    sleep_hours = Column(Float, default=7.0)
    social_media_hours = Column(Float, default=2.0)
    exam_pressure = Column(Float, default=5.0) # Scale 1-10
    stress_level = Column(Integer, default=1) # e.g. 0=Low, 1=Medium, 2=High
    
    # Relationships
    user = relationship("User", back_populates="student_profile")
    submissions = relationship("Submission", back_populates="student")
    predictions = relationship("MLPrediction", back_populates="student", uselist=False)

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    teacher = relationship("User", back_populates="courses_taught")
    tasks = relationship("Task", back_populates="course")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(String(20), nullable=False)  # 'assignment', 'quiz', 'video'
    due_date = Column(DateTime, nullable=True)
    
    # Relationships
    course = relationship("Course", back_populates="tasks")
    submissions = relationship("Submission", back_populates="task")

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"))
    grade = Column(Float, nullable=True)  # Grade out of 100
    feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    task = relationship("Task", back_populates="submissions")
    student = relationship("StudentProfile", back_populates="submissions")

class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), unique=True)
    predicted_gpa = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)  # 'Low', 'Medium', 'High'
    recommendations = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    student = relationship("StudentProfile", back_populates="predictions")

class NptelCourse(Base):
    __tablename__ = "nptel_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    instructor = Column(String(100), nullable=True)
    thumbnail_url = Column(String(255), nullable=True)
    
    # Relationships
    videos = relationship("NptelVideo", back_populates="course", cascade="all, delete-orphan")

class NptelVideo(Base):
    __tablename__ = "nptel_videos"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("nptel_courses.id", ondelete="CASCADE"))
    title = Column(String(200), nullable=False)
    youtube_id = Column(String(50), nullable=False)
    order = Column(Integer, default=1)
    
    # Relationships
    course = relationship("NptelCourse", back_populates="videos")
