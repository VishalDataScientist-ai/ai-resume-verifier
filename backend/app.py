import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Candidate, DemoRequest, User, IdentityVerification, OTPRecord
from config import Config
from services.parser import analyze_resume
from services.github_scanner import analyze_github_profile
from services.leetcode_scanner import analyze_leetcode_profile
from services.scorer import calculate_authenticity
from datetime import datetime, timedelta
import random
import re
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Import Layer 2 Dual-Layer Verification
from core.identity_engine.aggregator import process_identity_video, calculate_final_trust_score

def send_otp_email(receiver_email, otp_code):
    sender_email = os.environ.get('MAIL_USERNAME')
    sender_password = os.environ.get('MAIL_PASSWORD')
    
    if not sender_email or not sender_password:
        print(f"WARNING: Email credentials not set. Mocking email: OTP for {receiver_email} is {otp_code}")
        return False # Fall back to returning success so the frontend doesn't break during local testing without credentials
        
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your Verification Code - Nexus AI"
    message["From"] = sender_email
    message["To"] = receiver_email
    
    text = f"""\
    Hello!
    
    Your verification code for Nexus AI account creation is: {otp_code}
    
    This code will expire in 10 minutes.
    
    If you did not request this code, please ignore this email.
    """
    
    part1 = MIMEText(text, "plain")
    message.attach(part1)
    
    try:
        # Using Gmail's SMTP server by default. (Requires an "App Password" if 2FA is enabled)
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error dropping email: {e}")
        return False

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"})

    @app.route('/api/analyze', methods=['POST'])
    def analyze_candidate():
        try:
            name = request.form.get('name', '')
            email = request.form.get('email', '')
            github_url = request.form.get('github_username', '')
            # Extract just the username if a full url was provided
            github_username = github_url.strip('/')
            if 'github.com' in github_username:
                github_username = github_username.split('/')[-1]
                
            portfolio_url = request.form.get('portfolio_url', '')
            linkedin_url = request.form.get('linkedin_url', '')
            leetcode_url = request.form.get('leetcode_url', '')
            job_role = request.form.get('job_role', '')
            
            # File Upload
            if 'resume' not in request.files:
                return jsonify({"error": "No resume file provided"}), 400
            
            resume_file = request.files['resume']
            pdf_bytes = resume_file.read()
            
            # 1. Parse Resume
            resume_data = analyze_resume(pdf_bytes, job_role=job_role)
            
            if not name and resume_data.get('extracted_name'):
                name = resume_data.get('extracted_name')
            
            # 2. Analyze GitHub (Deep matched against job role)
            github_data = analyze_github_profile(
                github_username, 
                claimed_skills=resume_data.get('extracted_skills', []),
                required_skills=resume_data.get('required_skills', [])
            )
            
            # 3. Analyze LinkedIn
            linkedin_data = analyze_linkedin_profile(
                linkedin_url,
                required_skills=resume_data.get('required_skills', []),
                extracted_skills=resume_data.get('extracted_skills', [])
            )
            
            # 4. Analyze LeetCode
            leetcode_data = analyze_leetcode_profile(
                 leetcode_url,
                 required_skills=resume_data.get('required_skills', [])
            )
            
            # 5. Analyze Portfolio (Mock for now)
            portfolio_data = {"valid": bool(portfolio_url), "projects_found": 3} if portfolio_url else {"valid": False}
            
            # 6. Calculate Authenticity
            score_data = calculate_authenticity(github_data, portfolio_data, resume_data, linkedin_data, leetcode_data)
            
            # Save to Database
            candidate = Candidate(
                name=name,
                email=email,
                github_username=github_username,
                portfolio_url=portfolio_url,
                linkedin_url=linkedin_url,
                leetcode_url=leetcode_url,
                job_role=job_role,
                authenticity_score=score_data['final_score'],
                github_score=score_data['components'].get('github_score', 0.0),
                linkedin_score=linkedin_data.get('skill_match_score', 0.0) * 100 if linkedin_data else 0.0,
                leetcode_score=leetcode_data.get('proficiency_score', 0.0) * 100 if leetcode_data else 0.0,
                project_match_score=score_data['components'].get('project_match_score', 0.0),
                portfolio_evidence_score=score_data['components'].get('portfolio_evidence_score', 0.0),
                cv_raw_document=resume_file.read() if resume_file else None,
                cv_filename=resume_file.filename if resume_file else None,
                resume_text=resume_data.get('raw_text', ''),
                extracted_skills=resume_data.get('extracted_skills', []),
                missing_skills=resume_data.get('missing_skills', []),
                risk_alerts=score_data['risk_alerts'],
                ai_summary=score_data['ai_summary']
            )
            
            db.session.add(candidate)
            db.session.commit()
            # Prevent jsonify from crashing on binary data
            if 'cv_raw_document' in resume_data:
                del resume_data['cv_raw_document']

            return jsonify({
                "candidate_id": candidate.id,
                "score_data": score_data,
                "resume_data": resume_data,
                "github_data": github_data,
                "linkedin_data": linkedin_data,
                "leetcode_data": leetcode_data
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/candidates', methods=['GET'])
    def get_candidates():
        candidates = Candidate.query.order_by(Candidate.authenticity_score.desc()).all()
        return jsonify([c.to_dict() for c in candidates]), 200

    @app.route('/api/candidates/<int:candidate_id>', methods=['GET'])
    def get_candidate(candidate_id):
        candidate = Candidate.query.get_or_404(candidate_id)
        return jsonify(candidate.to_dict()), 200

    @app.route('/api/candidates/<int:candidate_id>/resume_download', methods=['GET'])
    def download_resume(candidate_id):
        candidate = Candidate.query.get_or_404(candidate_id)
        if not candidate.cv_raw_document:
            return jsonify({"error": "No physical document stored for this candidate."}), 404
        
        from io import BytesIO
        
        # Determine mimetype based on filename extension
        filename = candidate.cv_filename or "document.pdf"
        mimetype = "application/pdf"
        if filename.endswith(".docx"):
            mimetype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            
        return send_file(
            BytesIO(candidate.cv_raw_document),
            mimetype=mimetype,
            as_attachment=True,
            download_name=filename
        )

    @app.route('/api/verify-identity', methods=['POST'])
    def verify_identity():
        try:
            candidate_id = request.form.get('candidate_id')
            if not candidate_id:
                return jsonify({"error": "Candidate ID is required"}), 400
                
            if 'video' not in request.files:
                return jsonify({"error": "No interview video provided"}), 400
                
            video_file = request.files['video']
            
            # Save video to temp dir
            temp_dir = os.path.join(app.root_path, 'temp_video_processing')
            os.makedirs(temp_dir, exist_ok=True)
            
            video_path = os.path.join(temp_dir, f"candidate_{candidate_id}_video.webm")
            video_file.save(video_path)
            
            # Run Dual-Layer AI Process
            identity_results = process_identity_video(video_path)
            
            # Update Database
            candidate = Candidate.query.get(candidate_id)
            if not candidate:
                return jsonify({"error": "Candidate not found"}), 404
                
            # Create sub-model metrics
            iv = IdentityVerification(
                candidate_id=candidate.id,
                face_anomaly_score=identity_results['sub_scores']['face_anomaly_score'],
                blink_consistency_score=identity_results['sub_scores']['blink_consistency_score'],
                audio_sync_score=identity_results['sub_scores']['audio_sync_score'],
                identity_score=identity_results['identity_score']
            )
            db.session.add(iv)
            
            # Combine Layer 1 and 2
            skill_score = candidate.authenticity_score
            final_trust, risk_class = calculate_final_trust_score(skill_score, iv.identity_score)
            
            candidate.final_trust_score = final_trust
            candidate.risk_classification = risk_class
            
            db.session.commit()
            
            # Cleanup temp video
            try:
                os.remove(video_path)
            except:
                pass
                
            return jsonify({
                "status": "success",
                "candidate_id": candidate.id,
                "identity_score": iv.identity_score,
                "sub_scores": identity_results['sub_scores'],
                "final_trust_score": final_trust,
                "risk_classification": risk_class
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @app.route('/api/demo', methods=['POST'])
    def request_demo():
        try:
            data = request.json
            name = data.get('name')
            email = data.get('email')
            company = data.get('company')
            date = data.get('date')
            message = data.get('message', '')
            
            if not all([name, email, company, date]):
                return jsonify({"error": "Missing required fields"}), 400
                
            demo_req = DemoRequest(
                name=name,
                email=email,
                company=company,
                date=date,
                message=message
            )
            
            db.session.add(demo_req)
            db.session.commit()
            
            return jsonify({"status": "success", "message": "Demo request recorded", "id": demo_req.id}), 201
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/request-otp', methods=['POST'])
    def request_otp():
        try:
            data = request.json
            email = data.get('email')
            
            if not email:
                return jsonify({"error": "Email is required"}), 400
                
            # Check if user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({"error": "This email is already used."}), 409
                
            # Generate 6-digit OTP
            otp_code = f"{random.randint(100000, 999999)}"
            expiration = datetime.utcnow() + timedelta(minutes=10)
            
            # Store in DB (Overwriting old OTPs for that email)
            existing_otp = OTPRecord.query.filter_by(email=email).first()
            if existing_otp:
                db.session.delete(existing_otp)
                
            new_otp = OTPRecord(email=email, otp_code=otp_code, expires_at=expiration)
            db.session.add(new_otp)
            db.session.commit()
            
            # Send the actual email
            email_sent = send_otp_email(email, otp_code)
            
            if email_sent:
                return jsonify({"status": "success", "message": "OTP sent to your email!"}), 200
            else:
                # If email failed (e.g. invalid credentials), we still return success for local testing purposes to not break the UI flow, 
                # but in production you might want to return a 500 error here.
                return jsonify({"status": "warning", "message": "OTP generated locally (check console), email not configured."}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/signup', methods=['POST'])
    def signup():
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')
            otp_attempt = data.get('otp')
            
            if not email or not password or not otp_attempt:
                return jsonify({"error": "Email, password, and OTP are required"}), 400
                
            # Password Strength Validation (Min 8 chars, 1 letter, 1 number)
            if len(password) < 8 or not re.search(r'[A-Za-z]', password) or not re.search(r'[0-9]', password):
                return jsonify({"error": "Password must be at least 8 characters long and contain both letters and numbers."}), 400

            # Verify OTP
            otp_record = OTPRecord.query.filter_by(email=email, otp_code=otp_attempt).first()
            
            if not otp_record:
                return jsonify({"error": "Invalid OTP code"}), 401
                
            if datetime.utcnow() > otp_record.expires_at:
                return jsonify({"error": "OTP has expired. Please request a new one."}), 401
                
            # Check if user already exists (just in case they were fast)
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({"error": "This email is already used."}), 409
                
            hashed_password = generate_password_hash(password)
            new_user = User(email=email, password_hash=hashed_password)
            
            db.session.add(new_user)
            db.session.delete(otp_record) # clear used OTP
            db.session.commit()
            
            return jsonify({"status": "success", "message": "Account created successfully", "user": new_user.to_dict(), "access_token": "dummy_token_for_now"}), 201
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({"error": "Email and password are required"}), 400
                
            user = User.query.filter_by(email=email).first()
            
            if not user or not check_password_hash(user.password_hash, password):
                return jsonify({"error": "Invalid email or password"}), 401
                
            return jsonify({"status": "success", "message": "Logged in successfully", "user": user.to_dict(), "access_token": "dummy_token_for_now"}), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/user/update', methods=['POST'])
    def update_user():
        try:
            data = request.json
            user_id = data.get('user_id')
            new_email = data.get('email')
            
            if not user_id or not new_email:
                return jsonify({"error": "User ID and new email required"}), 400
                
            user = User.query.get(user_id)
            if not user:
                return jsonify({"error": "User not found"}), 404
                
            # Check if email is taken
            if new_email != user.email:
                existing = User.query.filter_by(email=new_email).first()
                if existing:
                    return jsonify({"error": "Email already in use"}), 409
                user.email = new_email
                db.session.commit()
                
            return jsonify({"status": "success", "user": user.to_dict()}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/user/password', methods=['POST'])
    def update_password():
        try:
            data = request.json
            user_id = data.get('user_id')
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            if not all([user_id, current_password, new_password]):
                return jsonify({"error": "All fields required"}), 400
                
            user = User.query.get(user_id)
            if not user or not check_password_hash(user.password_hash, current_password):
                return jsonify({"error": "Incorrect current password"}), 401
                
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            
            return jsonify({"status": "success"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/forgot-password', methods=['POST'])
    def forgot_password():
        try:
            data = request.json
            email = data.get('email')
            new_password = data.get('new_password')
            
            if not email or not new_password:
                return jsonify({"error": "Email and new password are required"}), 400
                
            # Password Strength Validation (Min 8 chars, 1 letter, 1 number)
            if len(new_password) < 8 or not re.search(r'[A-Za-z]', new_password) or not re.search(r'[0-9]', new_password):
                return jsonify({"error": "Password must be at least 8 characters long and contain both letters and numbers."}), 400

            user = User.query.filter_by(email=email).first()
            if not user:
                # Return generic error for security (optional) or let them know account doesn't exist
                return jsonify({"error": "No account found with this email addres."}), 404
                
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            
            return jsonify({"status": "success", "message": "Password updated successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
