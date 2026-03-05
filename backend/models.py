from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Candidate(db.Model):
    __tablename__ = 'candidates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    github_username = db.Column(db.String(100), nullable=True)
    portfolio_url = db.Column(db.String(200), nullable=True)
    linkedin_url = db.Column(db.String(200), nullable=True)
    leetcode_url = db.Column(db.String(200), nullable=True)
    job_role = db.Column(db.String(100), nullable=True)
    
    # Authenticity Scores
    authenticity_score = db.Column(db.Float, default=0.0)
    github_score = db.Column(db.Float, default=0.0)
    linkedin_score = db.Column(db.Float, default=0.0)
    leetcode_score = db.Column(db.Float, default=0.0)
    project_match_score = db.Column(db.Float, default=0.0)
    experience_consistency_score = db.Column(db.Float, default=0.0)
    portfolio_evidence_score = db.Column(db.Float, default=0.0)
    # Extracted unstructured data
    cv_raw_document = db.Column(db.LargeBinary, nullable=True)
    cv_filename = db.Column(db.String(255), nullable=True)
    resume_text = db.Column(db.Text, nullable=True)
    extracted_skills = db.Column(db.JSON, default=list)
    missing_skills = db.Column(db.JSON, default=list)
    risk_alerts = db.Column(db.JSON, default=list)
    ai_summary = db.Column(db.Text, nullable=True)
    
    # Layer 2: Final Verification aggregation
    final_trust_score = db.Column(db.Float, nullable=True)
    risk_classification = db.Column(db.String(20), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    identity_verification = db.relationship('IdentityVerification', backref='candidate', uselist=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'github_username': self.github_username,
            'portfolio_url': self.portfolio_url,
            'linkedin_url': self.linkedin_url,
            'leetcode_url': self.leetcode_url,
            'job_role': self.job_role,
            'authenticity_score': self.authenticity_score,
            'github_score': self.github_score,
            'linkedin_score': self.linkedin_score,
            'leetcode_score': self.leetcode_score,
            'project_match_score': self.project_match_score,
            'experience_consistency_score': self.experience_consistency_score,
            'portfolio_evidence_score': self.portfolio_evidence_score,
            'extracted_skills': self.extracted_skills,
            'missing_skills': self.missing_skills,
            'risk_alerts': self.risk_alerts,
            'ai_summary': self.ai_summary,
            'final_trust_score': self.final_trust_score,
            'risk_classification': self.risk_classification,
            'identity_verification': self.identity_verification.to_dict() if self.identity_verification else None,
            'created_at': self.created_at.isoformat()
        }

class IdentityVerification(db.Model):
    __tablename__ = 'identity_verifications'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    
    # Layer 2 Sub-Scores
    face_anomaly_score = db.Column(db.Float, default=0.0)
    blink_consistency_score = db.Column(db.Float, default=0.0)
    audio_sync_score = db.Column(db.Float, default=0.0)
    
    # Calculated Totals
    identity_score = db.Column(db.Float, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'face_anomaly_score': self.face_anomaly_score,
            'blink_consistency_score': self.blink_consistency_score,
            'audio_sync_score': self.audio_sync_score,
            'identity_score': self.identity_score
        }


class DemoRequest(db.Model):
    __tablename__ = 'demo_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'company': self.company,
            'date': self.date,
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class OTPRecord(db.Model):
    __tablename__ = 'otps'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp_code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
