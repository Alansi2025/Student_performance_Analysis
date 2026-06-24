import os
import logging
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("AIModule")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Configure Nvidia or Gemini
use_nvidia = bool(NVIDIA_API_KEY)
use_gemini = bool(GEMINI_API_KEY) and not use_nvidia

LOCAL_OLLAMA_URL = os.getenv("LOCAL_OLLAMA_URL", "http://localhost:11434/api/generate")
LOCAL_OLLAMA_MODEL = os.getenv("LOCAL_OLLAMA_MODEL", "gemma4:12b")

if use_nvidia:
    logger.info("Nvidia NIM API configured for text completions.")
elif use_gemini:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Google Gemini API configured successfully.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {e}")
        use_gemini = False
else:
    logger.warning(f"Neither NVIDIA_API_KEY nor GEMINI_API_KEY is set. Using local Ollama model ({LOCAL_OLLAMA_MODEL}) fallback.")

def get_ai_completion(prompt):
    """Sends a completion request to Nvidia NIM (OpenAI compatible), Gemini API, or local Ollama"""
    if use_nvidia:
        try:
            # Nvidia NIM Endpoint
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "meta/llama-3.1-8b-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
                "max_tokens": 512
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                logger.error(f"Nvidia API returned status code {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error calling Nvidia API: {e}")
            
    elif use_gemini:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            
    # Local Ollama Fallback
    try:
        payload = {
            "model": LOCAL_OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }
        response = requests.post(LOCAL_OLLAMA_URL, json=payload, timeout=30)
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            logger.error(f"Local Ollama API returned status code {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Error calling Local Ollama API: {e}")
        
    return None

def generate_student_recommendations(student_name, gpa, risk_level, attendance, study_hours, courses_grades=None):
    """
    Generates academic advice for the student.
    Uses AI if configured, else falls back to rule-based generation.
    """
    if courses_grades is None:
        courses_grades = []
        
    course_list_str = ", ".join([f"{c['name']} (Grade: {c['grade']})" for c in courses_grades]) if courses_grades else "various subjects"
    
    prompt = (
        f"You are the Academic Atelier AI Mascot, a friendly, intelligent floating robotic owl named Atelier Owl. "
        f"Give a short, encouraging, and actionable study recommendation (maximum 3 sentences) to a student "
        f"named {student_name} with GPA {gpa}, risk level {risk_level}, attendance {attendance}%, and study hours {study_hours} "
        f"per week. Current courses and grades: {course_list_str}. "
        f"Encourage them to build skills (like time management, analytics, or critical thinking) and tackle their tasks."
    )
    
    ai_response = get_ai_completion(prompt)
    if ai_response:
        return ai_response
            
    # Fallback response
    if risk_level == "High":
        return (
            f"Hi {student_name}! Atelier Owl here. I notice your GPA ({gpa}) is currently in the high-risk zone. "
            f"Let's focus on increasing study time to at least 15 hours a week and improving attendance ({attendance}%). "
            f"I recommend starting with your Advanced Mathematics video assignments today!"
        )
    elif risk_level == "Medium":
        return (
            f"Hello {student_name}! You're making progress, but there's room to grow! "
            f"With a GPA of {gpa}, boosting your study hours and reviewing feedback on Molecular Biology "
            f"will help secure an A. Try practicing the 'Analytical Logic' skill this week!"
        )
    else:
        return (
            f"Incredible job, {student_name}! A GPA of {gpa} puts you on the Dean's List! "
            f"Keep maintaining your {study_hours} hours/week routine. Have you explored the "
            f"advanced resources or helped peers in your cohort yet? You're doing amazing!"
        )

def generate_teacher_notes(student_name, gpa, risk_level, attendance, study_hours, sleep_hours=7.5, stress_level=5):
    """
    Generates predictive insights for teachers about a student.
    """
    prompt = (
        f"Write a professional predictive alert paragraph (1-2 sentences) for a teacher dashboard. "
        f"Analyze this student: {student_name}, Predicted GPA: {gpa}, Risk Tier: {risk_level}, "
        f"Attendance: {attendance}%, Weekly study hours: {study_hours}, Daily sleep hours: {sleep_hours}, "
        f"Self-reported stress level (1-10): {stress_level}. "
        f"Identify potential issues (e.g. attendance drop, study hours lag, lack of sleep, high stress) and recommend brief actions."
    )
    
    ai_response = get_ai_completion(prompt)
    if ai_response:
        return ai_response
            
    # Fallback
    if risk_level == "High":
        return (
            f"Student {student_name} displays high-risk academic markers with a predicted GPA of {gpa} and attendance "
            f"of {attendance}%. High stress ({stress_level}/10) or lack of sleep might be contributing. Immediate 1-on-1 counselor intervention is recommended."
        )
    elif risk_level == "Medium":
        return (
            f"{student_name} is performing steadily, but engagement patterns indicate potential burnout (Stress: {stress_level}/10). "
            f"Suggest checking in on study routines ({study_hours} hrs/week) and sleep schedule ({sleep_hours} hrs) to stabilize the grade trend."
        )
    else:
        return (
            f"{student_name} continues to show outstanding performance (predicted GPA: {gpa}). "
            f"Recommend encouraging participation in advanced peer mentoring or research tracks."
        )

def predict_next_year_paper(course_name, extracted_text):
    """
    Predicts a practice paper based on past papers using the AI model.
    """
    prompt = (
        f"You are an expert exam setter and curriculum designer for the course '{course_name}'. "
        f"I am providing you with the text extracted from a previous test paper for this course.\n\n"
        f"--- PAST PAPER TEXT ---\n"
        f"{extracted_text[:4000]}\n"  # Limit to 4000 chars to avoid token limits
        f"-----------------------\n\n"
        f"Based on the difficulty level, formatting, and topics covered in this past paper, generate a highly realistic "
        f"'Predicted Practice Paper' for next year. Include a mix of multiple-choice, short answer, and long essay questions as applicable. "
        f"Format your output in clean Markdown."
    )
    
    ai_response = get_ai_completion(prompt)
    if ai_response:
        return ai_response
        
    return "## Predicted Practice Paper\n\n*Error: Could not connect to AI services to generate the practice paper.*"


def get_ai_chat_response(messages):
    """Sends a conversational chat request to Ollama, Gemini, or Nvidia."""
    if use_nvidia:
        try:
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "meta/llama-3.1-8b-instruct",
                "messages": messages,
                "temperature": 0.5,
                "max_tokens": 1024
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                logger.error(f"Nvidia API returned status code {response.status_code}: {response.text}")
                return "Sorry, there was an error with the AI service."
        except Exception as e:
            logger.error(f"Error calling Nvidia API: {e}")
            return "Sorry, there was an error connecting to the AI service."
    elif use_gemini:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            conversation = ""
            for msg in messages:
                role = "User" if msg["role"] == "user" else "Assistant"
                conversation += f"{role}: {msg['content']}\n"
            response = model.generate_content(conversation)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return "Sorry, I am currently unavailable."
    else:
        try:
            # Ollama API
            url = LOCAL_OLLAMA_URL.replace("/api/generate", "/api/chat")
            payload = {
                "model": LOCAL_OLLAMA_MODEL,
                "messages": messages,
                "stream": False
            }
            response = requests.post(url, json=payload, timeout=20)
            if response.status_code == 200:
                result = response.json()
                return result.get("message", {}).get("content", "").strip()
            else:
                logger.error(f"Ollama API returned status code {response.status_code}: {response.text}")
                return "Sorry, my brain (Ollama) is currently offline or returning an error."
        except Exception as e:
            logger.error(f"Error calling Ollama API: {e}")
            return "Sorry, I couldn't reach my local brain (Ollama)."
