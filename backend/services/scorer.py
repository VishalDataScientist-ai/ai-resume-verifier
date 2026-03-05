def calculate_authenticity(github_data, portfolio_data, resume_data, linkedin_data=None, leetcode_data=None):
    """
    Calculates the final authenticity score based on features.
    Dynamically reweighs based on what profile URLs were provided.
    """
    
    # 1. Job Fit Score (Resume base match) (0-1)
    missing_skills = resume_data.get("missing_skills", [])
    required_skills = resume_data.get("required_skills", [])
    
    job_match_score = 0.0
    if len(required_skills) > 0:
        matched_count = len(required_skills) - len(missing_skills)
        job_match_score = max(0.0, matched_count / len(required_skills))
    else:
        job_match_score = 0.8  # Default baseline
    
    # 2. GitHub Score (0-1) includes deep skill matching
    gh_score = 0.0
    if github_data and github_data.get("exists"):
        gh_activity = github_data.get("activity_score", 0.0)
        gh_skill = github_data.get("skill_match_score", 0.0)
        gh_score = (gh_activity * 0.5) + (gh_skill * 0.5)
        
    # 3. LinkedIn Score (0-1)
    linkedin_score = 0.0
    has_linkedin = False
    if linkedin_data and linkedin_data.get("exists"):
        has_linkedin = True
        li_activity = linkedin_data.get("activity_score", 0.0)
        li_skill = linkedin_data.get("skill_match_score", 0.0)
        linkedin_score = (li_activity * 0.4) + (li_skill * 0.6)
        
    # 4. LeetCode Score (0-1)
    leetcode_score = 0.0
    has_leetcode = False
    if leetcode_data and leetcode_data.get("exists"):
        has_leetcode = True
        leetcode_score = leetcode_data.get("proficiency_score", 0.0)
        
    # 5. Portfolio Score (0-1)
    portfolio_score = 0.0
    has_portfolio = False
    if portfolio_data and portfolio_data.get("valid"):
        has_portfolio = True
        portfolio_score = 0.8 
        if portfolio_data.get("projects_found", 0) > 0:
            portfolio_score = 1.0
            
    # Calculate Dynamic Weights based on what was provided
    w_job_fit = 0.50
    w_github = 0.30 if github_data and github_data.get("exists") else 0.0
    w_portfolio = 0.20 if has_portfolio else 0.0
    w_linkedin = 0.0
    w_leetcode = 0.0
    
    if has_linkedin:
        w_job_fit -= 0.10
        w_github = max(0.0, w_github - 0.05)
        w_linkedin = 0.15
        
    if has_leetcode:
        w_job_fit -= 0.05
        w_github = max(0.0, w_github - 0.05)
        w_portfolio = max(0.0, w_portfolio - 0.05)
        w_leetcode = 0.15
        
    # Normalize weights if some features are entirely missing (e.g. no GitHub, no portfolio)
    total_weights = w_job_fit + w_github + w_portfolio + w_linkedin + w_leetcode
    if total_weights < 1.0:
        # Boost Job Fit with the remainder
        remainder = 1.0 - total_weights
        w_job_fit += remainder
        
    final_score = (
        (job_match_score * w_job_fit) +
        (gh_score * w_github) +
        (portfolio_score * w_portfolio) +
        (linkedin_score * w_linkedin) +
        (leetcode_score * w_leetcode)
    )
    
    # Generate Risk Alerts
    alerts = []
    if missing_skills:
        alerts.append({
            "type": "danger", 
            "message": f"Critical skill gap. Missing {len(missing_skills)} required skills for this role: {', '.join(missing_skills[:4])}."
        })
    elif github_data and github_data.get("exists") and gh_score < 0.2:
        alerts.append({
            "type": "warning",
            "message": "Low verifiable open-source evidence or missing required languages on GitHub."
        })
        
    if not portfolio_data or not portfolio_data.get("valid"):
        alerts.append({
            "type": "info",
            "message": "No portfolio provided. Authenticity score may be lower."
        })
        
    # Generate AI Summary
    summary = ""
    if job_match_score >= 0.8:
        summary = "Strong candidate match for the role. "
    elif job_match_score >= 0.5:
        summary = "Moderate candidate match for the role. "
    else:
        summary = "Poor fit for the requested role. "
        
    if missing_skills:
        summary += f"Missing key skills: {', '.join(missing_skills[:3])}."
        if len(missing_skills) > 3:
            summary += f" and {len(missing_skills) - 3} more."
            
    summary += f" Final Trust calculation weighted heavily towards skill overlap."
        
    return {
        "final_score": round(final_score * 100, 1),
        "components": {
            "github_score": round(gh_score * 100, 1),
            "project_match_score": round(job_match_score * 100, 1), 
            "portfolio_evidence_score": round(portfolio_score * 100, 1)
        },
        "risk_alerts": alerts,
        "ai_summary": summary
    }
