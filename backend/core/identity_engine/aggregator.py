from .face_analyzer import FaceAnalyzer
from .liveness_detector import LivenessDetector
from .audio_sync import AudioSyncAnalyzer

def process_identity_video(video_path):
    """
    Orchestrates the Dual-Layer AI sub-models:
    1. Face Anomaly (MesoNet)
    2. Blink Liveness (MediaPipe)
    3. Audio Sync (SyncNet)
    Returns aggregated JSON for the API.
    """
    # 1. Init Analyzers
    face_net = FaceAnalyzer()
    liveness_net = LivenessDetector()
    audio_net = AudioSyncAnalyzer()
    
    # 2. Run Inferences (Usually Async/Threaded in Production)
    face_score = face_net.analyze_video(video_path)
    blink_score = liveness_net.analyze_blinks(video_path)
    audio_score = audio_net.analyze_audio_sync(video_path)
    
    # 3. Calculate Final Aggregate (Weights: Face=50%, Blink=25%, Audio=25%)
    identity_score = (face_score * 0.50) + (blink_score * 0.25) + (audio_score * 0.25)
    
    return {
        "status": "success",
        "identity_score": round(identity_score, 2),
        "sub_scores": {
            "face_anomaly_score": face_score,
            "blink_consistency_score": blink_score,
            "audio_sync_score": audio_score
        }
    }

def calculate_final_trust_score(skill_score, identity_score):
    """
    Dual-Layer Formula: (0.6 * Skill Authenticity) + (0.4 * Identity Authenticity)
    Additionally calculates the Risk Alert threshold. 
    """
    total_trust = (0.6 * skill_score) + (0.4 * identity_score)
    total_trust = round(total_trust, 2)
    
    risk_classification = "Low"
    if skill_score < 50.0 or identity_score < 50.0:
        risk_classification = "High"
    elif total_trust < 75.0:
        risk_classification = "Medium"
        
    return total_trust, risk_classification
