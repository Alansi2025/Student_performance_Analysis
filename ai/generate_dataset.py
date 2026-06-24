import csv
import random
import numpy as np

def generate_student_csv(filename="../db/student_data.csv", num_students=500):
    first_names = [
        "Liam", "Noah", "Oliver", "James", "Elijah", "William", "Henry", "Lucas", "Benjamin", "Theodore",
        "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Charlotte", "Amelia", "Mia", "Harper", "Evelyn",
        "Alexander", "Michael", "Daniel", "Ethan", "Matthew", "Jackson", "Sebastian", "Jack", "Owen", "Aiden",
        "Abigail", "Emily", "Elizabeth", "Sofia", "Avery", "Ella", "Scarlett", "Grace", "Chloe", "Victoria"
    ]
    
    last_names = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
        "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
        "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
    ]

    random.seed(42)
    np.random.seed(42)
    
    headers = [
        "roll_no", "admin_no", "name", "email", "parent_name", "parent_phone",
        "class_name", "school_name", "school_board", "attendance_rate",
        "study_hours_per_week", "avg_grade", "gpa"
    ]
    
    with open(filename, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        
        # Define the 5 primary demo students explicitly
        demo_students = [
            ["2024-8842", "ADM-8842", "Alex Sterling", "alex@atelier.edu", "Mr. Sterling", "+1-555-0190", "Grade 12-A", "Academic Atelier Academy", "Standard Board", 92.0, 15.0, 84.2, 3.82],
            ["2024-29401", "ADM-29401", "Jane Doe", "jane@atelier.edu", "Mrs. Doe", "+1-555-0191", "Grade 12-A", "Academic Atelier Academy", "Standard Board", 98.0, 24.0, 97.0, 3.95],
            ["2024-29402", "ADM-29402", "Marcus Smith", "marcus@atelier.edu", "Mr. Smith", "+1-555-0192", "Grade 12-A", "Academic Atelier Academy", "Standard Board", 85.0, 6.0, 78.0, 2.8],
            ["2024-29403", "ADM-29403", "Aisha Lewis", "aisha@atelier.edu", "Mrs. Lewis", "+1-555-0193", "Grade 12-A", "Academic Atelier Academy", "Standard Board", 92.0, 18.0, 91.0, 3.5],
            ["2024-29404", "ADM-29404", "Tobias Kent", "tobias@atelier.edu", "Mr. Kent", "+1-555-0194", "Grade 12-A", "Academic Atelier Academy", "Standard Board", 64.0, 3.0, 50.0, 1.8]
        ]
        
        for ds in demo_students:
            writer.writerow(ds)
            
        # Generate the remaining 495 students randomly
        for i in range(1, num_students - len(demo_students) + 1):
            first = random.choice(first_names)
            last = random.choice(last_names)
            name = f"{first} {last}"
            email = f"{first.lower()}.{last.lower()}{i + 100}@atelier.edu"
            
            roll_no = f"2024-{1000 + i + 10}"
            admin_no = f"ADM-{1000 + i + 10}"
            
            parent_title = "Mr." if random.random() > 0.5 else "Mrs."
            parent_name = f"{parent_title} {last}"
            parent_phone = f"+1-555-{random.randint(1000, 9999)}"
            
            class_name = "Grade 12-A"
            school_name = "Academic Atelier Academy"
            school_board = "Standard Board"
            
            attendance = round(random.uniform(50.0, 100.0), 1)
            study_hours = round(random.uniform(2.0, 30.0), 1)
            avg_grade = round(random.uniform(40.0, 100.0), 1)
            
            # Predict GPA using formula with noise
            noise = np.random.normal(0, 0.12)
            gpa = 0.5 + 1.2 * (attendance / 100.0) + 0.8 * (study_hours / 30.0) + 1.5 * (avg_grade / 100.0) + noise
            gpa = round(float(np.clip(gpa, 0.0, 4.0)), 2)
            
            writer.writerow([
                roll_no, admin_no, name, email, parent_name, parent_phone,
                class_name, school_name, school_board, attendance,
                study_hours, avg_grade, gpa
            ])

            
    print(f"Generated {num_students} student records and saved to '{filename}'.")

if __name__ == "__main__":
    generate_student_csv()
