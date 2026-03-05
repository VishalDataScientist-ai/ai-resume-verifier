import requests
import re
from urllib.parse import urlparse

def analyze_leetcode_profile(profile_url, required_skills=None):
    """
    Parses a LeetCode profile to determine coding activity and problem-solving skills.
    LeetCode has public GraphQL endpoints we can lightly query without authentication.
    """
    if not profile_url:
        return None
        
    parsed = urlparse(profile_url)
    if "leetcode.com" not in parsed.netloc:
        return {"exists": False, "error": "Invalid LeetCode URL"}
        
    # Extract username from url (e.g., https://leetcode.com/u/vishalsingh/ -> vishalsingh or https://leetcode.com/vishalsingh -> vishalsingh)
    path_parts = [p for p in parsed.path.split('/') if p]
    username = None
    
    if path_parts:
        if path_parts[0] == 'u' and len(path_parts) > 1:
            username = path_parts[1]
        elif path_parts[-1] != 'u':
            username = path_parts[-1]
            
    if not username:
        return {"exists": False, "error": "Could not extract username"}

    # Use LeetCode GraphQL API to fetch user profile stats
    # Specifically: matchedUser { submitStats: { acSubmissionNum } }
    
    query = '''
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
            ranking
        }
      }
    }
    '''
    
    try:
        req = requests.post(
            'https://leetcode.com/graphql', 
            json={'query': query, 'variables': {'username': username}},
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        
        if req.status_code == 200:
            data = req.json()
            if data.get('data') and data['data'].get('matchedUser'):
                matched_user = data['data']['matchedUser']
                stats = matched_user.get('submitStats', {}).get('acSubmissionNum', [])
                
                total_solved = 0
                easy_solved = 0
                medium_solved = 0
                hard_solved = 0
                
                for stat in stats:
                    if stat['difficulty'] == 'All':
                        total_solved = stat['count']
                    elif stat['difficulty'] == 'Easy':
                        easy_solved = stat['count']
                    elif stat['difficulty'] == 'Medium':
                        medium_solved = stat['count']
                    elif stat['difficulty'] == 'Hard':
                        hard_solved = stat['count']
                
                # Calculate a proficiency score based on problem counts.
                # Heuristics: 50+ medium/hard is decent. 200+ total is good.
                score = 0.0
                if total_solved > 0:
                    score += 0.3 * min(1.0, total_solved / 200.0)
                    score += 0.4 * min(1.0, medium_solved / 100.0)
                    score += 0.3 * min(1.0, hard_solved / 50.0)
                    
                # Bonus if it's a backend or data job, leetcode matters more
                if required_skills:
                    role_str = " ".join([s.lower() for s in required_skills])
                    if any(bt in role_str for bt in ['python', 'java', 'c++', 'backend', 'data']):
                        # Just signal that leetcode is highly relevant for this role
                        pass

                return {
                    "exists": True,
                    "total_solved": total_solved,
                    "easy_solved": easy_solved,
                    "medium_solved": medium_solved,
                    "hard_solved": hard_solved,
                    "proficiency_score": min(1.0, score),
                    "profile_url": profile_url
                }
            else:
                return {"exists": False, "error": "User does not exist"}
        else:
             return {"exists": False, "error": "API returned non-200"}
             
    except Exception as e:
        print(f"LeetCode API Error: {e}")
        return {"error": str(e)}
