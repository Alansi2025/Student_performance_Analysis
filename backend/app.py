import os
import sys
import datetime

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from backend.database import engine, Base, SessionLocal
import backend.models as models
import backend.pdf_reader as pdf_reader
import ai.ml_module as ml_module
import ai.ai_module as ai_module

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-12345")

# Initialize database
Base.metadata.create_all(bind=engine)

def seed_database():
    """Seeds the database with high-fidelity student performance dummy data"""
    db = SessionLocal()
    try:
        print("Checking database seed status...")
        
        # Seed NPTEL Courses if empty
        if db.query(models.NptelCourse).count() == 0:
            print("Seeding NPTEL courses...")
            c1 = models.NptelCourse(
                title="Data Structures and Algorithms",
                description="A comprehensive introduction to fundamental data structures and algorithms.",
                instructor="Prof. Naveen Garg, IIT Delhi",
                thumbnail_url="https://img.youtube.com/vi/zWg7U0OEAoE/mqdefault.jpg"
            )
            c2 = models.NptelCourse(
                title="Introduction to Machine Learning",
                description="Learn the basics of machine learning, regression, and classification algorithms.",
                instructor="Prof. Sudeshna Sarkar, IIT Kharagpur",
                thumbnail_url="https://img.youtube.com/vi/OqK7r4y_nKI/mqdefault.jpg"
            )
            db.add_all([c1, c2])
            db.commit()

            # Add NptelVideos for Data Structures
            v1_c1 = models.NptelVideo(course_id=c1.id, title="Lecture 1: Introduction to Data Structures", youtube_id="zWg7U0OEAoE", order=1)
            v2_c1 = models.NptelVideo(course_id=c1.id, title="Lecture 2: Stacks", youtube_id="g1USSZVWDsY", order=2)
            v3_c1 = models.NptelVideo(course_id=c1.id, title="Lecture 3: Queues and Linked Lists", youtube_id="O1m_oX10D04", order=3)
            
            # Add NptelVideos for Machine Learning
            v1_c2 = models.NptelVideo(course_id=c2.id, title="Lecture 1: Introduction to Machine Learning", youtube_id="OqK7r4y_nKI", order=1)
            v2_c2 = models.NptelVideo(course_id=c2.id, title="Lecture 2: Linear Regression", youtube_id="1yX2F284Z1I", order=2)
            
            db.add_all([v1_c1, v2_c1, v3_c1, v1_c2, v2_c2])
            db.commit()

        # Check if users already exist
        if db.query(models.User).first():
            return
            
        print("Seeding database with default academic data...")
        
        # Create Teacher
        teacher_user = models.User(name="Dr. Julian Vance", email="teacher@atelier.edu", role="teacher")
        teacher_user.set_password("password")
        db.add(teacher_user)
        db.commit()
        
        # Create Courses
        c1 = models.Course(name="Advanced Mathematics II", description="Calculus, linear algebra and analytical logic.", teacher_id=teacher_user.id)
        c2 = models.Course(name="Molecular Biology", description="Genetics, molecular replication and laboratory practices.", teacher_id=teacher_user.id)
        c3 = models.Course(name="Modern Philosophy", description="Analytical ethics, metaphysics, and thesis defense.", teacher_id=teacher_user.id)
        db.add_all([c1, c2, c3])
        db.commit()

        # Create Tasks
        t1 = models.Task(course_id=c1.id, title="Calculus Mid-Term Exam", description="Analytical integration and derivation.", task_type="assignment", due_date=datetime.datetime.now() + datetime.timedelta(days=10))
        t2 = models.Task(course_id=c2.id, title="DNA Replication Video Lecture", description="Watch the 20-minute video assignment and write a lab review.", task_type="video", due_date=datetime.datetime.now() + datetime.timedelta(days=5))
        t3 = models.Task(course_id=c3.id, title="Philosophy Thesis Presentation", description="Presenting arguments on Modern Ethics.", task_type="assignment", due_date=datetime.datetime.now() + datetime.timedelta(days=12))
        db.add_all([t1, t2, t3])
        db.commit()

        # Read students from CSV
        import csv
        # update path to point to root project directory
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "student_data.csv")
        student_data = []
        
        if os.path.exists(csv_path):
            with open(csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                # Seed the first 15 students to populate the database roster
                for idx, row in enumerate(reader):
                    if idx >= 15:
                        break
                    
                    avg_g = float(row["avg_grade"])
                    # Mock individual course grades based on avg_grade
                    g1 = round(max(40.0, min(100.0, avg_g + 3.0)), 1)
                    g2 = round(max(40.0, min(100.0, avg_g - 4.0)), 1)
                    g3 = round(max(40.0, min(100.0, avg_g + 1.0)), 1)
                    
                    student_data.append({
                        "name": row["name"],
                        "email": row["email"],
                        "roll": row["roll_no"],
                        "admin": row["admin_no"],
                        "parent": row["parent_name"],
                        "phone": row["parent_phone"],
                        "attendance": float(row["attendance_rate"]),
                        "study_hours": float(row["study_hours_per_week"]),
                        "grades": [g1, g2, g3],
                        "gpa": float(row["gpa"])
                    })
        else:
            print("Warning: student_data.csv not found during seeding. Using basic fallback.")
            student_data = [
                {"name": "Alex Sterling", "email": "alex@atelier.edu", "roll": "2024-8842", "admin": "ADM-8842", "parent": "Mr. Sterling", "phone": "+1-555-0190", "attendance": 92.0, "study_hours": 15.0, "grades": [85.0, 80.0, 90.0], "gpa": 3.82}
            ]

        for s in student_data:
            user = models.User(name=s["name"], email=s["email"], role="student")
            user.set_password("password")
            db.add(user)
            db.commit()

            profile = models.StudentProfile(
                user_id=user.id,
                roll_no=s["roll"],
                admin_no=s["admin"],
                parent_name=s["parent"],
                parent_phone=s["phone"],
                class_name="Grade 12-A",
                school_name="Academic Atelier Academy",
                attendance_rate=s["attendance"],
                study_hours_per_week=s["study_hours"]
            )
            db.add(profile)
            db.commit()

            # Add submissions/grades
            for idx, task in enumerate([t1, t2, t3]):
                grade_val = s["grades"][idx]
                sub = models.Submission(
                    task_id=task.id,
                    student_id=profile.id,
                    grade=grade_val,
                    feedback=f"Feedback on {task.title}: Good progress." if grade_val >= 70 else "Needs improvement."
                )
                db.add(sub)
            db.commit()

            # Run ML Predictions
            avg_grade = sum(s["grades"]) / len(s["grades"])
            pred = ml_module.predict_performance(s["attendance"], s["study_hours"], avg_grade)
            
            # Generate AI notes
            ai_notes = ai_module.generate_teacher_notes(
                student_name=s["name"],
                gpa=pred["predicted_gpa"],
                risk_level=pred["risk_level"],
                attendance=s["attendance"],
                study_hours=s["study_hours"]
            )

            ml_pred = models.MLPrediction(
                student_id=profile.id,
                predicted_gpa=pred["predicted_gpa"],
                risk_level=pred["risk_level"],
                recommendations=ai_notes
            )
            db.add(ml_pred)
            db.commit()

        print("Database seeding completed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

seed_database()

# Authentication Helpers
def get_current_user():
    if "user_id" not in session:
        return None
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.id == session["user_id"]).first()
    db.close()
    return user

# Routes
@app.route("/")
def home():
    if "user_id" in session:
        role = session.get("role")
        if role == "teacher":
            return redirect(url_for("teacher_dashboard"))
        return redirect(url_for("student_dashboard"))
    return render_template("intro.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        
        db = SessionLocal()
        user = db.query(models.User).filter(models.User.email == email).first()
        db.close()
        
        if user and user.check_password(password):
            session["user_id"] = user.id
            session["role"] = user.role
            session["user_name"] = user.name
            flash(f"Welcome back, {user.name}!", "success")
            if user.role == "teacher":
                return redirect(url_for("teacher_dashboard"))
            return redirect(url_for("student_dashboard"))
        else:
            flash("Invalid email or password.", "error")
            
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("You have been signed out.", "info")
    return redirect(url_for("login"))

@app.route("/practice_papers", methods=["GET", "POST"])
def practice_papers():
    role = request.args.get("role", request.form.get("role", "student"))
    generated_paper = None
    
    if request.method == "POST":
        course_name = request.form.get("course_name")
        if "file" not in request.files:
            flash("No file uploaded.", "error")
            return redirect(url_for('practice_papers', role=role))
            
        file = request.files["file"]
        if file.filename == "":
            flash("No selected file.", "error")
            return redirect(url_for('practice_papers', role=role))
            
        if file and file.filename.endswith(".pdf"):
            import tempfile
            from backend.pdf_reader import extract_text_from_pdf
            from ai.ai_module import predict_next_year_paper
            
            # Save file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                file.save(temp_file.name)
                temp_path = temp_file.name
                
            try:
                # Extract text
                extracted_text = extract_text_from_pdf(temp_path)
                # Predict practice paper
                generated_paper = predict_next_year_paper(course_name, extracted_text)
                flash("Practice paper successfully generated!", "success")
            except Exception as e:
                flash(f"Error processing the file: {str(e)}", "error")
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
        else:
            flash("Only PDF files are supported.", "error")
            return redirect(url_for('practice_papers', role=role))
            
    return render_template("practice_papers.html", role=role, generated_paper=generated_paper)

@app.route("/profile")
def profile():
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = SessionLocal()
    student_profile = None
    if user.role == "student":
        student_profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == user.id).first()
    db.close()
    
    return render_template("profile.html", user=user, profile=student_profile)

@app.route("/nptel_courses")
def nptel_courses():
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = SessionLocal()
    courses = db.query(models.NptelCourse).all()
    for course in courses:
        _ = course.videos
    db.close()
    
    return render_template("nptel_courses.html", user=user, courses=courses)

@app.route("/nptel_course/<int:course_id>")
def nptel_course(course_id):
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = SessionLocal()
    course = db.query(models.NptelCourse).filter(models.NptelCourse.id == course_id).first()
    if not course:
        db.close()
        flash("Course not found.", "error")
        return redirect(url_for('nptel_courses'))
        
    videos = db.query(models.NptelVideo).filter(models.NptelVideo.course_id == course_id).order_by(models.NptelVideo.order).all()
    db.close()
    
    # Get the currently requested video, or default to the first one
    video_id = request.args.get('video_id')
    current_video = next((v for v in videos if v.youtube_id == video_id), videos[0] if videos else None)
    
    return render_template("nptel_player.html", user=user, course=course, videos=videos, current_video=current_video)

@app.route("/teacher", methods=["GET", "POST"])
def teacher_dashboard():
    user = get_current_user()
    if not user or user.role != "teacher":
        flash("Access denied. Please log in as a teacher.", "error")
        return redirect(url_for("login"))
        
    db = SessionLocal()
    
    # Handle New Student Registration
    if request.method == "POST":
        try:
            name = request.form.get("name")
            email = request.form.get("email")
            roll_no = request.form.get("roll_no")
            admin_no = request.form.get("admin_no")
            parent_name = request.form.get("parent_name")
            parent_phone = request.form.get("parent_phone")
            class_name = request.form.get("class_name", "Grade 12-A")
            school_name = request.form.get("school_name", "Academic Atelier Academy")
            school_board = request.form.get("school_board", "Standard Board")
            
            attendance = float(request.form.get("attendance_rate", 90.0))
            study_hours = float(request.form.get("study_hours", 10.0))
            avg_grade = float(request.form.get("avg_grade", 75.0))
            sleep_hours = float(request.form.get("sleep_hours", 7.5))
            social_media_hours = float(request.form.get("social_media_hours", 2.0))
            exam_pressure = int(request.form.get("exam_pressure", 5))
            stress_level = int(request.form.get("stress_level", 5))
            
            # Check if email or roll number exists
            existing_user = db.query(models.User).filter(models.User.email == email).first()
            if existing_user:
                flash(f"Email {email} is already registered.", "error")
            else:
                # Create user
                new_user = models.User(name=name, email=email, role="student")
                new_user.set_password("password") # Default password
                db.add(new_user)
                db.commit()
                
                # Create profile
                profile = models.StudentProfile(
                    user_id=new_user.id,
                    roll_no=roll_no,
                    admin_no=admin_no,
                    parent_name=parent_name,
                    parent_phone=parent_phone,
                    class_name=class_name,
                    school_name=school_name,
                    school_board=school_board,
                    attendance_rate=attendance,
                    study_hours_per_week=study_hours,
                    sleep_hours=sleep_hours,
                    social_media_hours=social_media_hours,
                    exam_pressure=exam_pressure,
                    stress_level=stress_level
                )
                db.add(profile)
                db.commit()
                
                # Add default grades/submissions
                t1 = db.query(models.Task).first()
                if t1:
                    db.add(models.Submission(task_id=t1.id, student_id=profile.id, grade=avg_grade, feedback="Initial placement grade."))
                    db.commit()
                
                # Predict performance
                pred = ml_module.predict_performance(
                    attendance, study_hours, avg_grade,
                    sleep_hours=sleep_hours, social_media_hours=social_media_hours,
                    exam_pressure=exam_pressure, stress_level=stress_level
                )
                ai_notes = ai_module.generate_teacher_notes(
                    student_name=name,
                    gpa=pred["predicted_gpa"],
                    risk_level=pred["risk_level"],
                    attendance=attendance,
                    study_hours=study_hours,
                    sleep_hours=sleep_hours,
                    stress_level=stress_level
                )
                
                ml_pred = models.MLPrediction(
                    student_id=profile.id,
                    predicted_gpa=pred["predicted_gpa"],
                    risk_level=pred["risk_level"],
                    recommendations=ai_notes
                )
                db.add(ml_pred)
                db.commit()
                flash(f"Student {name} registered successfully with predicted GPA of {pred['predicted_gpa']}.", "success")
        except Exception as e:
            db.rollback()
            flash(f"Error registering student: {e}", "error")
            
    # Load dashboard data
    students = db.query(models.StudentProfile).join(models.User).all()
    
    # Calculate stats
    total_students = len(students)
    class_avg = 0.0
    students_list_data = []
    at_risk_alerts = []
    
    if total_students > 0:
        gpas = []
        for s in students:
            # Calculate actual average grade from submissions
            sub_grades = [sub.grade for sub in s.submissions if sub.grade is not None]
            avg_g = sum(sub_grades) / len(sub_grades) if sub_grades else 75.0
            
            # Get prediction
            pred_gpa = s.predictions.predicted_gpa if s.predictions else 2.5
            risk_l = s.predictions.risk_level if s.predictions else "Medium"
            recs = s.predictions.recommendations if s.predictions else ""
            
            gpas.append(pred_gpa)
            
            students_list_data.append({
                "id": s.id,
                "name": s.user.name,
                "roll_no": s.roll_no,
                "grade_letter": "A+" if pred_gpa >= 3.7 else "A" if pred_gpa >= 3.4 else "B" if pred_gpa >= 2.8 else "C" if pred_gpa >= 2.0 else "D",
                "attendance": f"{int(s.attendance_rate)}%",
                "study_hours": s.study_hours_per_week,
                "sleep_hours": s.sleep_hours,
                "stress_level": s.stress_level,
                "social_media_hours": s.social_media_hours,
                "progress_percent": int((pred_gpa / 4.0) * 100),
                "risk": risk_l,
                "avatar_init": "".join([n[0] for n in s.user.name.split() if n])
            })
            
            if risk_l in ["High", "Medium"]:
                at_risk_alerts.append({
                    "name": s.user.name,
                    "risk": risk_l,
                    "predicted_gpa": pred_gpa,
                    "details": recs,
                    "attendance": s.attendance_rate,
                    "phone": s.parent_phone
                })
                
        class_avg = sum(gpas) / len(gpas) if gpas else 0.0
        
    class_avg_percent = round((class_avg / 4.0) * 100, 1)
    
    db.close()
    return render_template(
        "teacher_dashboard.html",
        teacher_name=user.name,
        total_students=total_students,
        class_avg=class_avg_percent,
        students=students_list_data,
        alerts=at_risk_alerts
    )

@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    user = get_current_user()
    if not user or user.role != "teacher":
        return jsonify({"error": "Unauthorized"}), 403
        
    if "pdf_file" not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files["pdf_file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.lower().endswith(".pdf"):
        # Save temp file
        import tempfile
        import subprocess
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, file.filename)
        file.save(temp_path)
        
        try:
            # Process using the external python environment
            pdf_reader_script = os.path.join(os.path.dirname(__file__), "pdf_reader.py")
            result = subprocess.run([pdf_reader_script, temp_path], capture_output=True, text=True, check=True)
            extracted_text = result.stdout.strip()
            
            if not extracted_text:
                analysis_result = "No text could be extracted from the PDF."
            else:
                import google.generativeai as genai
                api_key = os.getenv("GEMINI_API_KEY")
                if not api_key:
                    analysis_result = "GEMINI_API_KEY is not configured. Cannot perform analysis on extracted text."
                else:
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    
                    prompt = (
                        "You are an academic analysis assistant. Below is raw text extracted from a "
                        "student's document or report using OCR. "
                        "Please analyze the text and provide a concise summary of the student's performance, "
                        "identifying key strengths, weaknesses, and a suggested grade or feedback.\n\n"
                        f"Extracted Text:\n{extracted_text}"
                    )
                    
                    response = model.generate_content(prompt)
                    analysis_result = response.text
        except subprocess.CalledProcessError as e:
            analysis_result = f"Error during OCR extraction: {e.stderr}"
        except Exception as e:
            analysis_result = f"Error processing PDF: {str(e)}"
        
        # Cleanup
        try:
            os.remove(temp_path)
            os.rmdir(temp_dir)
        except Exception:
            pass
            
        return jsonify({"analysis": analysis_result})
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route("/student")
def student_dashboard():
    user = get_current_user()
    if not user or user.role != "student":
        flash("Access denied. Please log in as a student.", "error")
        return redirect(url_for("login"))
        
    db = SessionLocal()
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == user.id).first()
    
    if not profile:
        db.close()
        flash("Student profile not found.", "error")
        return redirect(url_for("login"))
        
    # Get predictions
    pred_gpa = profile.predictions.predicted_gpa if profile.predictions else 2.5
    risk_level = profile.predictions.risk_level if profile.predictions else "Medium"
    
    # Load tasks and assignments
    submissions = profile.submissions
    completed_task_ids = [sub.task_id for sub in submissions]
    
    # All tasks
    all_tasks = db.query(models.Task).all()
    tasks_list_data = []
    
    for t in all_tasks:
        sub = next((s for s in submissions if s.task_id == t.id), None)
        status = "Completed" if sub else "Pending"
        grade_str = f"{int(sub.grade)}%" if (sub and sub.grade is not None) else "N/A"
        feedback = sub.feedback if sub else ""
        
        # Color codes based on course/task
        bg_color = "bg-primary-fixed" if t.task_type == "assignment" else "bg-secondary-fixed" if t.task_type == "video" else "bg-primary-fixed-dim"
        icon = "functions" if "math" in t.title.lower() else "biotech" if "biol" in t.title.lower() else "history_edu"
        
        tasks_list_data.append({
            "title": t.title,
            "course": t.course.name,
            "type": t.task_type.capitalize(),
            "due": t.due_date.strftime("%d %b %Y") if t.due_date else "N/A",
            "grade": grade_str,
            "feedback": feedback,
            "bg_color": bg_color,
            "icon": icon,
            "status": status
        })
        
    # Get study grades mapping for AI module
    courses_grades = []
    for sub in submissions:
        courses_grades.append({
            "name": sub.task.course.name,
            "grade": sub.grade
        })
        
    # Generate Mascot Recommendation
    mascot_rec = ai_module.generate_student_recommendations(
        student_name=user.name,
        gpa=pred_gpa,
        risk_level=risk_level,
        attendance=profile.attendance_rate,
        study_hours=profile.study_hours_per_week,
        courses_grades=courses_grades
    )
    
    db.close()
    
    return render_template(
        "student_dashboard.html",
        student_name=user.name,
        roll_no=profile.roll_no,
        gpa=f"{pred_gpa:.2f}",
        attendance=int(profile.attendance_rate),
        study_hours=int(profile.study_hours_per_week),
        tasks=tasks_list_data,
        mascot_rec=mascot_rec
    )

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
